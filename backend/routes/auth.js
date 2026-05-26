const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, studentDetails, recruiterDetails, adminDetails } = req.body;

    // Block public admin registration
    if (role === 'admin') {
      return res.status(403).json({ success: false, message: 'Administrator registration is restricted.' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      studentDetails: studentDetails || {},
      recruiterDetails: recruiterDetails || {},
      adminDetails: adminDetails || {}
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentDetails: user.studentDetails,
          recruiterDetails: user.recruiterDetails,
          adminDetails: user.adminDetails
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentDetails: user.studentDetails,
        recruiterDetails: user.recruiterDetails,
        adminDetails: user.adminDetails
      }
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        studentDetails: req.user.studentDetails,
        recruiterDetails: req.user.recruiterDetails,
        adminDetails: req.user.adminDetails
      }
    });
  } catch (error) {
    console.error('Profile Retrieval Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all registered students
// @route   GET /api/auth/students
// @access  Private
router.get('/students', protect, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json({ success: true, students });
  } catch (error) {
    console.error('Fetch Students Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all registered recruiters
// @route   GET /api/auth/recruiters
// @access  Private
router.get('/recruiters', protect, async (req, res) => {
  try {
    const recruiters = await User.find({ role: 'recruiter' }).select('-password');
    res.json({ success: true, recruiters });
  } catch (error) {
    console.error('Fetch Recruiters Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update user profile by ID (Admin or Self)
// @route   PUT /api/auth/users/:id
// @access  Private
router.put('/users/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Only allow the user themselves or an admin to update
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { name, email, studentDetails, recruiterDetails, adminDetails } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    
    // Deep merge details with markModified to guarantee Mongoose writes changes to MongoDB
    if (studentDetails) {
      Object.keys(studentDetails).forEach(key => {
        user.studentDetails[key] = studentDetails[key];
      });
      user.markModified('studentDetails');
    }
    if (recruiterDetails) {
      Object.keys(recruiterDetails).forEach(key => {
        user.recruiterDetails[key] = recruiterDetails[key];
      });
      user.markModified('recruiterDetails');
    }
    if (adminDetails) {
      Object.keys(adminDetails).forEach(key => {
        user.adminDetails[key] = adminDetails[key];
      });
      user.markModified('adminDetails');
    }

    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentDetails: user.studentDetails,
        recruiterDetails: user.recruiterDetails,
        adminDetails: user.adminDetails
      }
    });
  } catch (error) {
    console.error('Update User Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Increment recruiter company profile views
// @route   PUT /api/auth/recruiters/company/:companyName/view
// @access  Private
router.put('/recruiters/company/:companyName/view', protect, async (req, res) => {
  try {
    const recruiter = await User.findOne({ 
      role: 'recruiter',
      'recruiterDetails.company': { $regex: new RegExp(`^${req.params.companyName}$`, 'i') }
    });

    if (!recruiter) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    if (!recruiter.recruiterDetails.companyViews) {
      recruiter.recruiterDetails.companyViews = 0;
    }
    recruiter.recruiterDetails.companyViews += 1;
    recruiter.markModified('recruiterDetails');
    await recruiter.save();

    res.json({ success: true, companyViews: recruiter.recruiterDetails.companyViews });
  } catch (error) {
    console.error('Increment Views Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete user account
// @route   DELETE /api/auth/users/:id
// @access  Private
router.delete('/users/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Only allow self or admin to delete
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Cleanup student data
    if (user.role === 'student') {
      const Application = require('../models/Application');
      const Interview = require('../models/Interview');
      const Notification = require('../models/Notification');
      
      await Application.deleteMany({ studentEmail: user.email });
      await Interview.deleteMany({ studentEmail: user.email });
      
      // Delete notifications sent to the student OR referencing the student
      await Notification.deleteMany({
        $or: [
          { recipientEmail: user.email },
          { title: { $regex: user.name, $options: 'i' } },
          { message: { $regex: user.name, $options: 'i' } }
        ]
      });

      // Recalculate recruiter applicants count
      const Job = require('../models/Job');
      const recruiters = await User.find({ role: 'recruiter' });
      for (const rec of recruiters) {
        if (rec.recruiterDetails?.company) {
          const companyJobs = await Job.find({ company: { $regex: new RegExp("^" + rec.recruiterDetails.company + "$", "i") } });
          const jobIds = companyJobs.map(j => j._id.toString());
          const activeApplicantsCount = await Application.countDocuments({ jobId: { $in: jobIds } });
          
          rec.recruiterDetails.totalApplicantsCount = activeApplicantsCount;
          rec.markModified('recruiterDetails');
          await rec.save();
        }
      }

      // Recalculate admin students count
      const admins = await User.find({ role: 'admin' });
      const totalStudents = await User.countDocuments({ role: 'student' });
      for (const admin of admins) {
        if (admin.adminDetails) {
          admin.adminDetails.totalStudentsCount = Math.max(0, totalStudents - 1);
          admin.markModified('adminDetails');
          await admin.save();
        }
      }
    }

    // Cleanup recruiter data
    if (user.role === 'recruiter') {
      const Job = require('../models/Job');
      const Application = require('../models/Application');
      const Interview = require('../models/Interview');
      const Notification = require('../models/Notification');

      const companyName = user.recruiterDetails?.company;
      if (companyName) {
        // Find jobs, applications, and interviews
        const recruiterJobs = await Job.find({ company: { $regex: new RegExp("^" + companyName + "$", "i") } });
        const jobIds = recruiterJobs.map(j => j._id.toString());

        const applicationsToDelete = await Application.find({ jobId: { $in: jobIds } });
        const interviewsToDelete = await Interview.find({ 
          $or: [
            { jobId: { $in: jobIds } }, 
            { company: { $regex: new RegExp("^" + companyName + "$", "i") } }
          ] 
        });

        // Delete records
        await Job.deleteMany({ _id: { $in: jobIds } });
        await Application.deleteMany({ jobId: { $in: jobIds } });
        await Interview.deleteMany({ 
          $or: [
            { jobId: { $in: jobIds } }, 
            { company: { $regex: new RegExp("^" + companyName + "$", "i") } }
          ] 
        });

        // Delete notifications
        await Notification.deleteMany({
          $or: [
            { recipientEmail: user.email },
            { title: { $regex: companyName, $options: 'i' } },
            { message: { $regex: companyName, $options: 'i' } }
          ]
        });

        // Recalculate student metrics
        const studentEmails = Array.from(new Set([
          ...applicationsToDelete.map(app => app.studentEmail.toLowerCase()),
          ...interviewsToDelete.map(int => int.studentEmail.toLowerCase())
        ]));

        for (const email of studentEmails) {
          const studentUser = await User.findOne({ email, role: 'student' });
          if (studentUser) {
            const remainingAppsCount = await Application.countDocuments({ studentEmail: email });
            const remainingIntsCount = await Interview.countDocuments({ studentEmail: email });
            studentUser.studentDetails.appliedJobsCount = remainingAppsCount;
            studentUser.studentDetails.interviewsCount = remainingIntsCount;
            studentUser.markModified('studentDetails');
            await studentUser.save();
          }
        }

        // Recalculate admin metrics
        const admins = await User.find({ role: 'admin' });
        const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
        for (const admin of admins) {
          if (admin.adminDetails) {
            admin.adminDetails.totalRecruitersCount = Math.max(0, totalRecruiters - 1);
            admin.markModified('adminDetails');
            await admin.save();
          }
        }
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete User Account Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
