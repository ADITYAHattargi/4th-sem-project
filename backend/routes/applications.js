const express = require('express');
const Application = require('../models/Application');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   POST api/apply/:postId
// @desc    Apply to job post (students only)
router.post('/:postId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can apply' });
    }

    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post || post.user.role !== 'business') {
      return res.status(400).json({ error: 'Invalid post' });
    }

    const existing = await Application.findExisting({ postId, studentId: req.user.id });
    if (existing) {
      return res.status(400).json({ error: 'Already applied' });
    }

    const application = await Application.create({ postId, studentId: req.user.id });
    res.status(201).json(application);
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ error: 'Application failed' });
  }
});

// @route   GET api/apply/my-applications
// @desc    Get my applications (students)
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.findForStudent(req.user.id);
    res.json(applications);
  } catch (error) {
    console.error('My applications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET api/apply/:postId/applications
// @desc    Get post applications (business owners)
router.get('/:postId/applications', auth, async (req, res) => {
  try {
    if (req.user.role !== 'business') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post || String(post.userId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Not your post' });
    }

    const applications = await Application.findForPost(req.params.postId);
    res.json(applications);
  } catch (error) {
    console.error('Post applications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT api/apply/:id/status
// @desc    Update application status (business)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'business') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await Application.updateStatus({ id: req.params.id, status });
    res.json(application);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;

