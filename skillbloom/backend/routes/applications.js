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
    const { coverLetter } = req.body;

    // Check post exists & is business post
    const post = await Post.findById(postId).populate('user', 'role');
    if (!post || post.user.role !== 'business') {
      return res.status(400).json({ error: 'Invalid post' });
    }

    // Check if already applied
    const existing = await Application.findOne({ 
      student: req.user._id, 
      post: postId 
    });
    if (existing) {
      return res.status(400).json({ error: 'Already applied' });
    }

    const application = new Application({
      student: req.user._id,
      post: postId,
      coverLetter: coverLetter || ''
    });

    await application.save();
    await application.populate([
      { path: 'student', select: 'name profileImage skills city' },
      { path: 'post', populate: { path: 'user', select: 'name' } }
    ]);

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Application failed' });
  }
});

// @route   GET api/apply/my-applications
// @desc    Get my applications (students)
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('post', 'caption media jobTitle user')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
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
    if (!post || String(post.user) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Not your post' });
    }

    const applications = await Application.find({ post: req.params.postId })
      .populate('student', 'name profileImage skills city bio')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
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

    const { status, businessNotes } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, businessNotes },
      { new: true }
    ).populate('student post');

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;

