const express = require('express');
const multer = require('multer');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// @route   GET api/posts
// @desc    Get all posts (feed)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, role, userId } = req.query;
    const posts = await Post.findAll({ page, limit, role, userId });
    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST api/posts
// @desc    Create post (protected)
router.post('/', auth, upload.single('media'), async (req, res) => {
  try {
    const { title, caption, description, jobType, location, stipend } = req.body;

    const imageUrl = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
      : req.body.imageUrl || '';

    const post = await Post.create({
      userId: req.user.id,
      title: title || caption || 'Untitled post',
      description: description || caption || '',
      imageUrl,
      jobType,
      location,
      stipend
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// @route   GET api/posts/:id
// @desc    Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
