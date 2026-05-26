const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Fetch Applications Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { jobId, studentEmail, studentName, department, cgpa, skills, appliedDate } = req.body;

    const application = await Application.create({
      jobId,
      studentEmail,
      studentName,
      department,
      cgpa,
      skills: skills || [],
      status: 'Applied',
      appliedDate: appliedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    console.error('Create Application Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.json({ success: true, application });
  } catch (error) {
    console.error('Update Application Status Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update offered CTC on a placed application
// @route   PUT /api/applications/:id/ctc
// @access  Private
router.put('/:id/ctc', protect, async (req, res) => {
  try {
    const { ctc, isInternational, isPpo, hasMultipleOffers } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    if (ctc !== undefined) application.ctc = ctc;
    if (isInternational !== undefined) application.isInternational = isInternational;
    if (isPpo !== undefined) application.isPpo = isPpo;
    if (hasMultipleOffers !== undefined) application.hasMultipleOffers = hasMultipleOffers;
    
    await application.save();
    res.json({ success: true, application });
  } catch (error) {
    console.error('Update Application CTC Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
