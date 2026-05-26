const mongoose = require('mongoose');

const EligibilitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a criteria title'],
    unique: true,
    trim: true
  },
  detail: {
    type: String,
    required: [true, 'Please add details for this criteria'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Eligibility', EligibilitySchema);
