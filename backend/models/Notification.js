const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipientEmail: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  time: {
    type: String,
    default: 'Just now'
  },
  read: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['success', 'info', 'warning', 'error'],
    default: 'info'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', NotificationSchema);
