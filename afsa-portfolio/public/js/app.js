(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById('theme-toggle');
  function syncThemeLabel() {
    var isDark = root.getAttribute('data-theme') !== 'light';
    themeBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    syncThemeLabel();
  });
  syncThemeLabel();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menu-toggle');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Projects (fetched from the API) ---------- */
  var listEl = document.getElementById('projects-list');
  var statusEl = document.getElementById('projects-status');

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text; // textContent, never innerHTML: keeps data from becoming markup
    return node;
  }

  function link(href, label) {
    var a = el('a', '', label);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    return a;
  }

  function renderProject(p) {
    var article = el('article', 'project');

    var meta = el('div', 'project-meta');
    meta.appendChild(el('p', 'project-cat', p.category));
    meta.appendChild(el('p', 'project-role', p.role));

    var body = el('div', 'project-body');
    body.appendChild(el('h3', '', p.title));
    body.appendChild(el('p', 'project-summary', p.summary));
    body.appendChild(el('p', '', p.description));

    if (p.techStack && p.techStack.length) {
      var tech = el('ul', 'tech');
      p.techStack.forEach(function (t) { tech.appendChild(el('li', '', t)); });
      body.appendChild(tech);
    }

    var links = el('p', 'project-links');
    if (p.githubUrl) links.appendChild(link(p.githubUrl, 'View code on GitHub'));
    if (p.liveUrl) links.appendChild(link(p.liveUrl, 'Open live demo'));
    if (p.videoUrl) links.appendChild(link(p.videoUrl, 'Watch demo video'));
    if (links.childNodes.length) body.appendChild(links);

    article.appendChild(meta);
    article.appendChild(body);
    return article;
  }

  function showProjectError() {
    statusEl.hidden = false;
    statusEl.textContent = '';
    statusEl.appendChild(document.createTextNode('The projects could not be loaded. Check your connection, then '));
    var retry = el('button', 'linklike', 'try again');
    retry.type = 'button';
    retry.addEventListener('click', loadProjects);
    statusEl.appendChild(retry);
    statusEl.appendChild(document.createTextNode('.'));
  }

  function loadProjects() {
    listEl.textContent = '';
    statusEl.hidden = false;
    statusEl.textContent = 'Loading projects…';

    // The free hosting tier sleeps when idle, so the first request can be slow.
    var wakeTimer = setTimeout(function () {
      statusEl.textContent = 'The server is waking up after being idle. This can take up to a minute…';
    }, 4000);

    var controller = new AbortController();
    var abortTimer = setTimeout(function () { controller.abort(); }, 90000);

    fetch('/api/projects', { signal: controller.signal })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed: ' + res.status);
        return res.json();
      })
      .then(function (projects) {
        if (!Array.isArray(projects) || projects.length === 0) {
          statusEl.textContent = 'No projects have been added yet. Run npm run seed to add them.';
          return;
        }
        statusEl.hidden = true;
        projects.forEach(function (p) { listEl.appendChild(renderProject(p)); });
      })
      .catch(function () { showProjectError(); })
      .finally(function () { clearTimeout(wakeTimer); clearTimeout(abortTimer); });
  }
  loadProjects();

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');
  var sendBtn = document.getElementById('send-btn');
  var formStatus = document.getElementById('form-status');
  var fields = ['name', 'email', 'message'];

  function setFieldError(field, text) {
    var input = document.getElementById(field);
    document.getElementById(field + '-error').textContent = text || '';
    if (text) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  function setStatus(text, kind) {
    formStatus.textContent = text;
    formStatus.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  // Quick checks in the browser for fast feedback. The server checks again, because it can't trust the browser.
  function validateLocally(data) {
    var errors = {};
    if (data.name.trim().length < 2) errors.name = 'Enter your name (at least 2 characters).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Enter a valid email address.';
    if (data.message.trim().length < 10) errors.message = 'Write a message of at least 10 characters.';
    return errors;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    fields.forEach(function (f) { setFieldError(f, ''); });
    setStatus('');

    var data = {
      // getElementById, not form.name: "form.name" is the form's own attribute, not the input
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value,
      website: document.getElementById('website').value
    };

    var localErrors = validateLocally(data);
    if (Object.keys(localErrors).length) {
      fields.forEach(function (f) { if (localErrors[f]) setFieldError(f, localErrors[f]); });
      var firstBad = fields.find(function (f) { return localErrors[f]; });
      document.getElementById(firstBad).focus();
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending…';

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) { return { res: res, body: body }; });
      })
      .then(function (r) {
        // Success is shown only when the server confirms it saved the message.
        if (r.res.status === 201 && r.body.ok) {
          form.reset();
          setStatus('Message sent. Thank you, I will reply by email.', 'ok');
        } else if (r.res.status === 400 && r.body.errors) {
          fields.forEach(function (f) { if (r.body.errors[f]) setFieldError(f, r.body.errors[f]); });
          setStatus('Please fix the highlighted fields.', 'error');
        } else if (r.res.status === 429) {
          setStatus('You have sent several messages recently. Please wait a few minutes and try again.', 'error');
        } else {
          setStatus('The message was not sent because of a server problem. Please try again, or email rafsa6879@gmail.com.', 'error');
        }
      })
      .catch(function () {
        setStatus('The message was not sent. Check your connection and try again.', 'error');
      })
      .finally(function () {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send message';
      });
  });
})();
