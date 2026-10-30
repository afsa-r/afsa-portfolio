// Applies the saved theme (dark by default) before first paint.
(function () {
  var theme = 'dark';
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch (e) { /* storage blocked: keep default */ }
  document.documentElement.setAttribute('data-theme', theme);
})();
