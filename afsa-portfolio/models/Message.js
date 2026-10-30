const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true, maxlength: 80 },
  email:     { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
  message:   { type: String, required: true, trim: true, maxlength: 1000 },
  status:    { type: String, enum: ['new', 'read'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
