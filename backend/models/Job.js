const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: 'Remote'
  },
  salary: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Full-time', 'Internship'],
    default: 'Full-time'
  },
  duration: {
    type: String,
    default: 'Full-time'
  },
  eligibility: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  skills: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  driveStatus: {
    type: String,
    enum: ['', 'Pending', 'Accepted', 'Rejected'],
    default: ''
  },
  takenDown: {
    type: Boolean,
    default: false
  },
  postedDate: {
    type: String
  },
  deadline: {
    type: String
  },
  tier: {
    type: String,
    enum: ['Tier 1', 'Tier 2', ''],
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', JobSchema);
