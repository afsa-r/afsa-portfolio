const mongoose = require('mongoose');

// A schema describes the shape of the data stored in MongoDB.
const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  summary:     { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  techStack:   { type: [String], default: [] },
  category:    { type: String, enum: ['Security', 'Web', 'Extension', 'Health', 'Game'], required: true },
  role:        { type: String, required: true, trim: true },
  githubUrl:   { type: String, trim: true, default: '' },
  liveUrl:     { type: String, trim: true, default: '' },
  videoUrl:    { type: String, trim: true, default: '' },
  featured:    { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
