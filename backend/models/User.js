const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'recruiter', 'admin'],
    required: [true, 'Please specify a user role']
  },
  
  // Student specific profile details
  studentDetails: {
    cgpa: { type: String, default: '' },
    department: { type: String, default: '' },
    batch: { type: String, default: '' },
    skills: { type: [String], default: [] },
    savedJobs: { type: [String], default: [] },
    resumeName: { type: String, default: '' },
    appliedJobsCount: { type: Number, default: 0 },
    interviewsCount: { type: Number, default: 0 },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    about: { type: String, default: '' },
    education: {
      type: [{
        school: { type: String, default: '' },
        degree: { type: String, default: '' },
        duration: { type: String, default: '' },
        grade: { type: String, default: '' }
      }],
      default: [
        { school: 'IIT Delhi', degree: 'B.Tech, Computer Science & Engineering', duration: '2022 - 2026', grade: 'CGPA 9.1' },
        { school: 'Delhi Public School, R.K. Puram', degree: 'CBSE Class XII', duration: '2022', grade: '97.4%' }
      ]
    },
    projects: {
      type: [{
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        date: { type: String, default: '' }
      }],
      default: [
        { title: 'Realtime fraud detection (Internship — Vault Capital)', description: 'Built streaming ML pipeline on Kafka + PyTorch reducing fraud losses by 23%.', date: 'Summer 2025' },
        { title: 'Open-source — torch-ensemble', description: 'Maintainer of PyTorch utility lib with 1.2k stars and 40+ contributors.', date: '2024 - present' }
      ]
    },
    certifications: {
      type: [{
        title: { type: String, default: '' },
        issuer: { type: String, default: '' },
        date: { type: String, default: '' }
      }],
      default: [
        { title: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', date: 'Feb 2025' },
        { title: 'Neural Networks and Deep Learning', issuer: 'DeepLearning.AI', date: 'Oct 2024' }
      ]
    }
  },
  
  // Recruiter specific profile details
  recruiterDetails: {
    company: { type: String, default: '' },
    designation: { type: String, default: '' },
    activeJobsCount: { type: Number, default: 0 },
    totalApplicantsCount: { type: Number, default: 0 },
    companyViews: { type: Number, default: 0 },
    tagline: { type: String, default: '' },
    about: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    contactEmail: { type: String, default: '' },
    companySize: { type: String, default: '' },
    industry: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    contactAddress: { type: String, default: '' },
    whatWeHireFor: {
      type: [{
        title: { type: String, default: '' },
        desc: { type: String, default: '' }
      }],
      default: [
        { title: 'Data Science', desc: 'Applied ML, forecasting, experimentation' },
        { title: 'Software Engineering', desc: 'Backend, infra, data platform' },
        { title: 'Research', desc: 'NLP, causal inference, RL' },
        { title: 'Design & Product', desc: 'UX research, product analytics' }
      ]
    }
  },
  
  // Admin specific profile details
  adminDetails: {
    designation: { type: String, default: '' },
    totalStudentsCount: { type: Number, default: 0 },
    totalRecruitersCount: { type: Number, default: 0 },
    placementPercentage: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
