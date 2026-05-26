const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const { protect } = require('../middleware/auth');

// @desc    Get all interviews
// @route   GET /api/interviews
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ createdAt: -1 });
    res.json({ success: true, interviews });
  } catch (error) {
    console.error('Fetch Interviews Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Schedule a new interview
// @route   POST /api/interviews
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { jobId, company, studentName, studentEmail, round, dateTime, mode, link } = req.body;

    const interview = await Interview.create({
      jobId,
      company,
      studentName,
      studentEmail,
      round,
      dateTime,
      mode,
      link: link || '',
      status: 'Scheduled'
    });

    res.status(201).json({ success: true, interview });
  } catch (error) {
    console.error('Schedule Interview Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update interview status (and optionally result)
// @route   PUT /api/interviews/:id/status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, result } = req.body;
    const updateFields = { status };
    if (result !== undefined) updateFields.result = result;
    const interview = await Interview.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }
    res.json({ success: true, interview });
  } catch (error) {
    console.error('Update Interview Status Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete an interview
// @route   DELETE /api/interviews/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete Interview Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
