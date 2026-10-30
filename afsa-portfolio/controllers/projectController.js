const Project = require('../models/Project');

// GET /api/projects: returns all projects, sorted by the "order" field.
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1 }).select('-__v').lean();
    res.status(200).json(projects);
  } catch (err) {
    next(err);
  }
};
