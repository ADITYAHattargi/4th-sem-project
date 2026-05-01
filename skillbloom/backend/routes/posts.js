const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// Cloudinary config (loaded from .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// @route   GET api/posts
// @desc    Get all posts (feed)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const query = role ? { 'user.role': role } : {};
    
    const posts = await Post.find(query)
      .populate('user', 'name profileImage role city')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST api/posts
// @desc    Create post (protected)
router.post('/', auth, upload.single('media'), async (req, res) => {
  try {
    const { caption, jobTitle, requirements, payRange, highlight } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Media required' });
    }

    // Upload to Cloudinary
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);
    
    const post = new Post({
      user: req.user._id,
      caption,
      media: result.secure_url,
      mediaType: result.resource_type === 'video' ? 'video' : 'image',
      ...(req.user.role === 'business' && { jobTitle, requirements: requirements?.split(',') || [], payRange, highlight })
    });

    await post.save();
    await post.populate('user', 'name profileImage role city');

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// @route   GET api/posts/:id
// @desc    Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'name profileImage role city');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

