const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET api/profiles
// @desc    Get all profiles (search)
router.get('/', async (req, res) => {
  try {
    const { role, city, skills, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (skills) query.skills = { $in: [skills] };

    const profiles = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET api/profiles/:id
// @desc    Get profile
router.get('/:id', async (req, res) => {
  try {
    const profile = await User.findById(req.params.id).select('-password');
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT api/profiles
// @desc    Update profile (protected)
router.put('/', auth, async (req, res) => {
  try {
    const updates = req.body;
    // Don't allow password/role change
    const allowed = ['name', 'bio', 'city', 'skills', 'shopType', 'shopSize', 'businessNature', 'gstNumber', 'productsServices'];
    const obj = {};

    allowed.forEach(field => {
      if (updates[field] !== undefined) obj[field] = updates[field];
    });

    const profile = await User.findByIdAndUpdate(
      req.user._id, 
      obj, 
      { new: true, runValidators: true }
    ).select('-password');

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;

