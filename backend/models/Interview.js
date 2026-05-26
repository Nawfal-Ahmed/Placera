const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  round: {
    type: String,
    required: true
  },
  dateTime: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  result: {
    type: String,
    enum: ['', 'Next Round', 'Eliminated', 'Placed'],
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', InterviewSchema);
