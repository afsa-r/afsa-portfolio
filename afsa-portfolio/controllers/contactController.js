const validator = require('validator');
const Message = require('../models/Message');

// POST /api/contact: validates the form and saves the message.
exports.createMessage = async (req, res, next) => {
  try {
    const { name, email, message, website } = req.body || {};

    // Honeypot: real people never see the hidden "website" field, bots fill it in.
    // We reply with a normal-looking success and save nothing.
    if (website) {
      return res.status(201).json({ ok: true });
    }

    const errors = {};
    const cleanName = typeof name === 'string' ? validator.stripLow(name).trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim() : '';
    const cleanMessage = typeof message === 'string' ? validator.stripLow(message, true).trim() : '';

    if (cleanName.length < 2 || cleanName.length > 80) {
      errors.name = 'Name must be 2 to 80 characters.';
    }
    if (!validator.isEmail(cleanEmail) || cleanEmail.length > 120) {
      errors.email = 'Please enter a valid email address.';
    }
    if (cleanMessage.length < 10 || cleanMessage.length > 1000) {
      errors.message = 'Message must be 10 to 1000 characters.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ ok: false, errors });
    }

    await Message.create({ name: cleanName, email: cleanEmail, message: cleanMessage });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
};
