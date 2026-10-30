# Afsa's Portfolio

A full-stack portfolio website: a plain HTML/CSS/JavaScript frontend, a Node.js + Express backend (REST API), and a MongoDB Atlas database.

## How it works

```
Browser ──fetch('/api/projects')──> Express route ──> controller ──> Mongoose model ──> MongoDB
Browser <───────── JSON ──────────────────────────────────────────────────────────────┘
Contact form ──POST /api/contact──> rate limiter ──> controller (validate + clean) ──> MongoDB (messages)
```

## Folder structure

```
afsa-portfolio/
├── server.js               Starts Express, security headers, routes, static files
├── config/db.js            MongoDB connection
├── models/                 Project.js and Message.js (data shapes)
├── controllers/            Logic for projects and contact form
├── routes/                 URL -> controller wiring
├── middleware/             Rate limiter and error handler
├── seed/seedProjects.js    Fills the database with your projects (safe to re-run)
├── public/                 The frontend (index.html, css/, js/, assets/)
├── .env.example            Template for secrets (copy to .env)
└── .gitignore              Keeps .env and node_modules out of GitHub
```

## API

| Method | Endpoint        | What it does                                                         |
|--------|-----------------|----------------------------------------------------------------------|
| GET    | `/api/health`   | Returns `{"status":"ok"}`                                            |
| GET    | `/api/projects` | Returns all projects sorted by `order` (200)                         |
| POST   | `/api/contact`  | Saves a message (201), invalid input (400), too many requests (429)  |

There are no public endpoints that create, edit or delete projects. To change projects, edit `seed/seedProjects.js` and run `npm run seed`.

## Run it on your computer

1. **Install packages** (inside this folder): `npm install`
2. **Create your secrets file:** copy `.env.example` to a new file named `.env`
3. **Add your Atlas connection string** to `MONGODB_URI` in `.env` only. Include the database name `portfolio` before the `?`:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority`
   Use a password of letters and numbers only. Never share this string or commit `.env`.
4. **In Atlas:** Database Access has a user with read/write permission, and Network Access allows `0.0.0.0/0`.
5. **Add the data:** `npm run seed` (expect `Seeded 5 projects`)
6. **Start the site:** `npm run dev`, then open http://localhost:3000
7. **Add your résumé:** put `Afsa_R_Resume.pdf` in `public/assets/`

## Test checklist

- http://localhost:3000/api/health shows `{"status":"ok"}`
- http://localhost:3000/api/projects shows 5 projects
- The page shows 5 project rows
- Contact form: submit empty (errors appear), submit valid (success message), then check Atlas > Browse Collections > portfolio > messages
- Send 6 valid messages quickly: the 6th shows the "wait a few minutes" message
- Theme toggle works and is remembered after refresh
- Resize the browser to phone width: the menu button appears and works
- No red errors in the browser console (F12) or the terminal

## Deploy on Render

1. Push this folder to a GitHub repository (never include `.env`).
2. Render > New > Web Service > connect the repo.
3. Build command: `npm install`  |  Start command: `npm start`  |  Instance: Free
4. Environment variables (in Render's dashboard): `MONGODB_URI` and `ALLOWED_ORIGIN` (your `https://....onrender.com` address).
5. Open `/api/health` on the live URL, then the home page, then send a test message.

The free tier sleeps when idle, so the first visit can take up to a minute. The site shows a "waking up" message while that happens.

## Before you submit

- Confirm the LinkedIn link in the footer opens your profile.
- Fill in MediLens' technologies in `seed/seedProjects.js`, then run `npm run seed` again.
- Check that the `DebtMap` repo link opens (rename the repo on GitHub if needed).
