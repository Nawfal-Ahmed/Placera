const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  cgpa: {
    type: String,
    required: true
  },
  skills: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected', 'Selected'],
    default: 'Applied'
  },
  ctc: {
    type: String,
    default: ''
  },
  isInternational: {
    type: Boolean,
    default: false
  },
  isPpo: {
    type: Boolean,
    default: false
  },
  hasMultipleOffers: {
    type: Boolean,
    default: false
  },
  appliedDate: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', ApplicationSchema);
