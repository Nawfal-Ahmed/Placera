const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// @desc    Get all notifications for current user
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Return notifications matching recipient email
    const notifications = await Notification.find({
      recipientEmail: req.user.email
    }).sort({ createdAt: -1 });

    res.json({ success: true, notifications });
  } catch (error) {
    console.error('Fetch Notifications Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a notification
// @route   POST /api/notifications
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { recipientEmail, title, message, type } = req.body;

    const notification = await Notification.create({
      recipientEmail,
      title,
      message,
      type: type || 'info',
      time: 'Just now'
    });

    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error('Create Notification Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Clear all notifications for current user
// @route   DELETE /api/notifications/clear
// @access  Private
router.delete('/clear', protect, async (req, res) => {
  try {
    await Notification.deleteMany({ recipientEmail: req.user.email });
    res.json({ success: true, message: 'All notifications cleared successfully' });
  } catch (error) {
    console.error('Clear Notifications Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json({ success: true, notification });
  } catch (error) {
    console.error('Mark Notification Read Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
