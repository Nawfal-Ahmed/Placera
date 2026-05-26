const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const { protect } = require('../middleware/auth');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Fetch Jobs Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { company, title, location, salary, type, duration, eligibility, description, skills, postedDate, deadline, status, driveStatus } = req.body;

    const job = await Job.create({
      company,
      title,
      location: location || 'Remote',
      salary,
      type: type || 'Full-time',
      duration: duration || 'Full-time',
      eligibility,
      description,
      skills: skills || [],
      status: req.user.role === 'admin' ? (status || 'Approved') : 'Pending',
      driveStatus: driveStatus || '',
      postedDate: postedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      deadline
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error('Create Job Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Approve a pending job listing
// @route   PUT /api/jobs/:id/approve
// @access  Private
router.put('/:id/approve', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const { tier } = req.body;
    job.status = 'Approved';
    if (tier) {
      job.tier = tier;
    }
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    console.error('Approve Job Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Reject/Delete a job listing
// @route   PUT /api/jobs/:id/reject
// @access  Private
router.put('/:id/reject', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    job.status = 'Rejected';
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    console.error('Reject Job Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Recruiter "takes down" a job (soft delete - hides from students but kept for application records)
// @route   PUT /api/jobs/:id/takedown
// @access  Private
router.put('/:id/takedown', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    job.takenDown = true;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    console.error('Takedown Job Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a job listing
// @route   PUT /api/jobs/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const { title, location, salary, type, duration, eligibility, description, skills, deadline, status, driveStatus } = req.body;

    if (title !== undefined) job.title = title;
    if (location !== undefined) job.location = location;
    if (salary !== undefined) job.salary = salary;
    if (type !== undefined) job.type = type;
    if (duration !== undefined) job.duration = duration;
    if (eligibility !== undefined) job.eligibility = eligibility;
    if (description !== undefined) job.description = description;
    if (skills !== undefined) job.skills = skills;
    if (deadline !== undefined) job.deadline = deadline;
    if (status !== undefined) job.status = status;
    if (driveStatus !== undefined) job.driveStatus = driveStatus;

    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    console.error('Update Job Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Hard delete a job listing (Admin only) - also cascades to applications and interviews
// @route   DELETE /api/jobs/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const jobId = req.params.id;

    // Cascade: delete all interviews for this job
    await Interview.deleteMany({ jobId: jobId.toString() });

    // Cascade: delete all applications for this job
    await Application.deleteMany({ jobId: jobId.toString() });

    // Delete the job itself
    await job.deleteOne();

    res.json({ success: true, message: 'Job posting and all associated records deleted successfully' });
  } catch (error) {
    console.error('Delete Job Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Increment job views
// @route   PUT /api/jobs/:id/view
// @access  Private
router.put('/:id/view', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (!job.views) {
      job.views = 0;
    }
    job.views += 1;
    await job.save();

    res.json({ success: true, views: job.views });
  } catch (error) {
    console.error('Increment Job Views Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
