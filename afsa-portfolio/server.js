const path = require('path');
const extModules = 'C:\\Users\\Afsa\\.afsa-deps\\node_modules';
process.env.NODE_PATH = (process.env.NODE_PATH ? process.env.NODE_PATH + ';' : '') + extModules;
require('module')._initPaths();

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1); // Render sits behind a proxy; needed so rate limiting sees real IPs
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || false }));
app.use(express.json({ limit: '10kb' })); // rejects oversized request bodies

// API routes
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api', notFound);

// Fallback for résumé PDF
app.get('/assets/Afsa_R_Resume.pdf', (req, res, next) => {
  const localResume = path.join(__dirname, 'public', 'assets', 'Afsa_R_Resume.pdf');
  const fallbackResume = 'C:\\Users\\Afsa\\Documents\\Downloads\\Afsa_R_Resume_SoftwareEngineering.pdf';
  const fs = require('fs');
  if (fs.existsSync(localResume)) {
    return res.sendFile(localResume);
  } else if (fs.existsSync(fallbackResume)) {
    return res.sendFile(fallbackResume);
  }
  next();
});

// Frontend files
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => {
    console.error('Failed to start:', err.message);
    process.exit(1);
  });
