const extModules = 'C:\\Users\\Afsa\\.afsa-deps\\node_modules';
process.env.NODE_PATH = (process.env.NODE_PATH ? process.env.NODE_PATH + ';' : '') + extModules;
require('module')._initPaths();

require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project');

const projects = [
  {
    title: 'Dark Funds',
    slug: 'dark-funds',
    summary: 'A layered anti-money-laundering detection system for law enforcement use.',
    description:
      'An end-to-end platform that runs 5 independent detection algorithms (high-frequency detection, large-amount flagging, multi-identity tracking, circular transaction detection and rapid-movement analysis) over a 200,000-transaction dataset. It includes a Flask backend, SQLite schema, REST API and an interactive spider-map that traces money trails between linked accounts. Registered as a copyright by the Copyright Office, Government of India (Certificate No. SW-2026022438).',
    techStack: ['Python', 'Flask', 'SQLite', 'NetworkX'],
    category: 'Security',
    role: 'Sole developer on a 2-student project under faculty guidance',
    githubUrl: 'https://github.com/afsa-r/DARK-FUNDS',
    videoUrl: 'https://youtu.be/2RYol4xmOlk',
    featured: true,
    order: 1
  },
  {
    title: 'DebtMap',
    slug: 'debtmap',
    summary: 'A debt payoff planner that makes different kinds of debt comparable.',
    description:
      'Normalizes credit cards, BNPL, personal loans and EMIs into one comparable annualized interest rate. The FastAPI backend simulates avalanche and snowball payoff strategies month by month and includes a regex-based SMS parser for 4 Indian bank/lender formats. The React frontend has an interactive burndown chart and a savings calculator.',
    techStack: ['Python', 'FastAPI', 'React', 'Vite'],
    category: 'Web',
    role: 'Individual project (backend and frontend)',
    githubUrl: 'https://github.com/afsa-r/DebtMap',
    featured: true,
    order: 2
  },
  {
    title: 'SpeakPublic',
    slug: 'speakpublic',
    summary: 'A browser extension that makes complex web content easier to understand.',
    description:
      'Translates and simplifies content such as government notices, hospital forms and bank letters into regional languages. It offers four accessibility modes: Standard (translation), Visual (audio guides), Hearing (sign-language support using an ISL dataset) and Cognitive (simplified icons). Uses the Gemini API for translation, simplification and readability scoring.',
    techStack: ['JavaScript', 'HTML', 'CSS', 'Gemini API'],
    category: 'Extension',
    role: 'Team lead of a 5-member team; built the extension architecture and overlay UI',
    githubUrl: 'https://github.com/afsa-r/speakpublic',
    featured: true,
    order: 3
  },
  {
    title: 'MediLens',
    slug: 'medilens',
    summary: 'Plain-language summaries for medicine labels, saved privately on your device.',
    description:
      'You type in the medicine details (name, strength, how often) and get a plain-language summary with a safety double-check. A photo upload is available but only works for some labels. Saved reports stay on the device. MediLens is an educational tool, not medical advice.',
    techStack: [], // Add MediLens technologies here once confirmed, then run: npm run seed
    category: 'Health',
    role: 'Personal project',
    liveUrl: 'https://medi-lens-viewer--rafsa1012.replit.app',
    order: 4
  },
  {
    title: 'Fruit Ninja',
    slug: 'fruit-ninja',
    summary: 'A fruit-slicing game built with Pygame.',
    description: 'A small game built in Python with Pygame.',
    techStack: ['Python', 'Pygame'],
    category: 'Game',
    role: 'Personal project',
    githubUrl: 'https://github.com/afsa-r/FRUITNINJA-GAME',
    order: 5
  }
];

// Upsert by slug: running this many times updates projects and never duplicates them.
async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const p of projects) {
    await Project.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, returnDocument: 'after', runValidators: true });
  }
  console.log(`Seeded ${projects.length} projects`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
