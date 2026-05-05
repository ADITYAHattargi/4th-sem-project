const express = require('express');
const Connection = require('../models/Connection');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'business') {
      return res.status(403).json({ error: 'Only businesses can invite students' });
    }

    const { studentId, message = '' } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: 'Student is required' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ error: 'Student not found' });
    }

    const connection = await Connection.create({
      businessId: req.user.id,
      studentId,
      message: String(message).trim().slice(0, 1000)
    });

    res.status(201).json(connection);
  } catch (error) {
    console.error('Create connection error:', error);
    res.status(500).json({ error: 'Invite failed' });
  }
});

router.get('/business', auth, async (req, res) => {
  try {
    if (req.user.role !== 'business') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(await Connection.findForBusiness(req.user.id));
  } catch (error) {
    console.error('Business connections error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/student', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(await Connection.findForStudent(req.user.id));
  } catch (error) {
    console.error('Student connections error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can respond to invites' });
    }

    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const connection = await Connection.updateStatus({
      id: req.params.id,
      studentId: req.user.id,
      status
    });

    if (!connection || String(connection.studentId) !== String(req.user.id)) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    res.json(connection);
  } catch (error) {
    console.error('Update connection status error:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;
