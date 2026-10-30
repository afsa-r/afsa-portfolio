const router = require('express').Router();
const { createMessage } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');

router.post('/', contactLimiter, createMessage);

module.exports = router;
