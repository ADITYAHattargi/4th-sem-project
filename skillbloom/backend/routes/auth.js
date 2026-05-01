// auth.js - Authentication routes for AI Career Guidance System (MySQL)
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// @route   POST /api/register
// @desc    Register new user (student or business)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, skills, city, photoUrl } = req.body;

    // Simple validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        error: 'Please provide name, email, password, and role' 
      });
    }

    if (role !== 'student' && role !== 'business') {
      return res.status(400).json({ 
        error: 'Role must be "student" or "business"' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user (password auto-hashed in User.create)
    const user = await User.create({
      name,
      email,
      password,
      role,
      skills: skills || [],
      city,
      photoUrl: photoUrl || 'https://i.pravatar.cc/150',
      profileData: {} // Empty object for role-specific data
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// @route   POST /api/login
// @desc    Authenticate user and return JWT token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    delete user.password;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// @route   POST /api/profile  
// @desc    Update user profile data (protected)
// @access  Private
router.post('/profile', async (req, res) => {
  try {
    const { skills, interests, education, companyName, industry, jobRequirements, city } = req.body;
    
    // Build update data based on role
    const updateData = {};
    
    if (req.user.role === 'student') {
      if (skills) updateData.skills = JSON.stringify(skills);
      if (interests) updateData.interests = JSON.stringify(interests);
      if (education) updateData.education = education;
      if (city) updateData.city = city;
    } else if (req.user.role === 'business') {
      if (companyName) updateData.companyName = companyName;
      if (industry) updateData.industry = industry;
      if (jobRequirements) updateData.jobRequirements = JSON.stringify(jobRequirements);
      if (city) updateData.city = city;
    }

    // Update in MySQL
    const user = await User.updateProfile(req.user.id, updateData);

    if (!user) {
      return res.status(400).json({ error: 'Failed to update profile' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// @route   GET /api/auth/user  
// @desc    Get current logged-in user profile
// @access  Private
router.get('/user', require('../middleware/auth'), async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

