const express = require('express');
const Project = require('../models/Project');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all project routes
router.use(authenticateToken);

// Get all projects for logged-in user
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync / Upsert a project by projectId
router.post('/sync', async (req, res) => {
  try {
    const { projectId, name, jsonBlob, updatedAt } = req.body;

    if (!projectId || !jsonBlob) {
      return res.status(400).json({ error: 'projectId and jsonBlob are required' });
    }

    const projectData = {
      userId: req.user.userId,
      projectId,
      name: name || (jsonBlob.meta && jsonBlob.meta.name) || 'Untitled Project',
      jsonBlob,
      updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
    };

    const project = await Project.findOneAndUpdate(
      { userId: req.user.userId, projectId },
      projectData,
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a project by projectId
router.delete('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await Project.findOneAndDelete({ userId: req.user.userId, projectId });

    if (!result) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
