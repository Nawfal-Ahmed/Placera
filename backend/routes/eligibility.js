const express = require('express');
const router = express.Router();
const Eligibility = require('../models/Eligibility');
const { protect } = require('../middleware/auth');

// @desc    Get all eligibility criteria
// @route   GET /api/eligibility
// @access  Private (any logged in user)
router.get('/', protect, async (req, res) => {
  try {
    const criteria = await Eligibility.find().sort({ createdAt: 1 });
    res.json({ success: true, criteria });
  } catch (error) {
    console.error('Fetch Eligibility Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a new eligibility criteria
// @route   POST /api/eligibility
// @access  Private (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admin can manage eligibility criteria' });
    }

    const { title, detail } = req.body;
    if (!title || !detail) {
      return res.status(400).json({ success: false, message: 'Please provide both title and detail' });
    }

    const exists = await Eligibility.findOne({ title });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Eligibility criteria with this title already exists' });
    }

    const criteria = await Eligibility.create({ title, detail });
    res.status(201).json({ success: true, criteria });
  } catch (error) {
    console.error('Create Eligibility Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update an eligibility criteria
// @route   PUT /api/eligibility/:id
// @access  Private (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admin can manage eligibility criteria' });
    }

    const { title, detail } = req.body;
    const criteria = await Eligibility.findById(req.params.id);

    if (!criteria) {
      return res.status(404).json({ success: false, message: 'Eligibility criteria not found' });
    }

    if (title) criteria.title = title;
    if (detail) criteria.detail = detail;

    await criteria.save();
    res.json({ success: true, criteria });
  } catch (error) {
    console.error('Update Eligibility Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete an eligibility criteria
// @route   DELETE /api/eligibility/:id
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admin can manage eligibility criteria' });
    }

    const criteria = await Eligibility.findById(req.params.id);
    if (!criteria) {
      return res.status(404).json({ success: false, message: 'Eligibility criteria not found' });
    }

    await criteria.deleteOne();
    res.json({ success: true, message: 'Eligibility criteria deleted successfully' });
  } catch (error) {
    console.error('Delete Eligibility Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
