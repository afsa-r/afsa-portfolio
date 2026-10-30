const rateLimit = require('express-rate-limit');

// Each IP can send 5 messages per 15 minutes.
exports.contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many messages. Please try again in a few minutes.' }
});
