const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

function parseJson(value, fallback) {
  if (!value) return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function toPublicProfile(user) {
  const profileData = parseJson(user.profileData, {});
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    skills: parseJson(user.skills, []),
    city: user.city || '',
    profilePhoto: user.profilePhoto || '',
    profileData,
    businessId: profileData.businessId || `BUS-${user.id}`,
    businessName: profileData.businessName || profileData.shopName || user.name,
    businessCategory: profileData.category || profileData.businessCategory || profileData.industry || ''
  };
}

// @route   GET api/profiles
// @desc    Get all profiles (search)
router.get('/', async (req, res) => {
  try {
    const { role, city, skills, page = 1, limit = 20 } = req.query;
    let profiles = await User.findAll();

    if (role) profiles = profiles.filter(user => user.role === role);
    if (city) profiles = profiles.filter(user => (user.city || '').toLowerCase().includes(city.toLowerCase()));
    if (skills) {
      const keyword = skills.toLowerCase();
      profiles = profiles.filter(user => parseJson(user.skills, []).some(skill => String(skill).toLowerCase().includes(keyword)));
    }

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const start = (pageNum - 1) * limitNum;

    res.json(profiles.slice(start, start + limitNum).map(toPublicProfile));
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET api/profiles/:id
// @desc    Get profile
router.get('/:id', async (req, res) => {
  try {
    const profile = await User.findById(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(toPublicProfile(profile));
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT api/profiles
// @desc    Update profile (protected)
router.put('/', auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowed = ['name', 'city', 'skills', 'profileData'];
    const updateData = {};

    allowed.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = field === 'profileData' ? JSON.stringify(updates[field]) : updates[field];
      }
    });

    const profile = await User.updateProfile(req.user.id, updateData);
    if (!profile) return res.status(400).json({ error: 'No valid profile fields provided' });

    res.json(toPublicProfile(profile));
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;
