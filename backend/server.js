// Premium DNS resolver override to fix Windows SRV resolution failures
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Interview = require('./models/Interview');
const Notification = require('./models/Notification');
const Eligibility = require('./models/Eligibility');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/interviews', require('./routes/interviews'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/eligibility', require('./routes/eligibility'));

// Root path response
app.get('/', (req, res) => {
  res.send('PLACERA API is running...');
});

// Automatic Atlas Database Seeding
const seedDatabase = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    // 1. Seed Admin
    const adminExists = await User.findOne({ email: 'admin@placera.edu' });
    if (!adminExists) {
      console.log('Seeding default admin user to MongoDB Atlas...');
      await User.create({
        name: 'Dr. R. Nair',
        email: 'admin@placera.edu',
        password: defaultPassword,
        role: 'admin',
        adminDetails: {
          designation: 'Placement Officer',
          totalStudentsCount: 1,
          totalRecruitersCount: 1,
          placementPercentage: 0
        }
      });
      console.log('Default admin user successfully seeded.');
    } else {
      console.log('Admin user already exists. Seeding skipped.');
    }

    // 2. Seed Student
    const studentExists = await User.findOne({ email: 'student@placera.edu' });
    if (!studentExists) {
      console.log('Seeding default student user to MongoDB Atlas...');
      await User.create({
        name: 'Nawfal Ahmed',
        email: 'student@placera.edu',
        password: defaultPassword,
        role: 'student',
        studentDetails: {
          roll: '24BCS0012',
          cgpa: '9.2',
          department: 'Computer Science & Engineering',
          batch: '2026',
          skills: ['Python', 'TensorFlow', 'React', 'MongoDB'],
          appliedJobsCount: 0,
          interviewsCount: 0
        }
      });
      console.log('Default student user successfully seeded.');
    } else {
      console.log('Student user already exists. Seeding skipped.');
    }

    // 3. Seed Recruiter
    const recruiterExists = await User.findOne({ email: 'talent@helixanalytics.com' });
    if (!recruiterExists) {
      console.log('Seeding default recruiter user to MongoDB Atlas...');
      await User.create({
        name: 'Hr. Sarah Jenkins',
        email: 'talent@helixanalytics.com',
        password: defaultPassword,
        role: 'recruiter',
        recruiterDetails: {
          company: 'Helix Analytics',
          designation: 'Talent Acquisition Lead',
          activeJobsCount: 0,
          totalApplicantsCount: 0,
          companyViews: 0,
          tagline: 'Leading data science and analytics platform',
          about: 'Helix Analytics is a premium research and software engineering enterprise specializing in predictive modeling and business intelligence.',
          location: 'Bangalore, India',
          website: 'https://helixanalytics.com',
          techStack: ['Node.js', 'React', 'Python', 'AWS'],
          contactEmail: 'talent@helixanalytics.com',
          companySize: '150 - 500',
          industry: 'Technology & Data Science'
        }
      });
      console.log('Default recruiter user successfully seeded.');
    } else {
      console.log('Recruiter user already exists. Seeding skipped.');
    }

    const eligibilityCount = await Eligibility.countDocuments();
    if (eligibilityCount === 0) {
      console.log('Seeding default eligibility rules...');
      const defaultRules = [
        { title: 'Standard Tech', detail: 'CGPA ≥ 8.0, no active backlogs' },
        { title: 'Premium Tech', detail: 'CGPA ≥ 8.5, top quartile' },
        { title: 'Research', detail: 'CGPA ≥ 9.0, 1 publication' },
        { title: 'Design', detail: 'Portfolio required' },
        { title: 'MBA', detail: 'CGPA ≥ 7.5, 1 internship' },
      ];
      await Eligibility.create(defaultRules);
      console.log('Default eligibility rules successfully seeded.');
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

// Seed database on startup
seedDatabase();

// Listen on Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
