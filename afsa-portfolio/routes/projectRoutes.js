const router = require('express').Router();
const { getProjects } = require('../controllers/projectController');

router.get('/', getProjects);

module.exports = router;
