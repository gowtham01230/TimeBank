const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const adminController = require('../controllers/adminController');

// @route   GET api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', [authMiddleware, adminMiddleware], adminController.getAllUsers);

// @route   PUT api/admin/users/:userId
// @desc    Update a user's status or time balance
// @access  Admin
router.put('/users/:userId', [authMiddleware, adminMiddleware], adminController.updateUser);

// @route   POST api/admin/users/:userId/notify
// @desc    Send a notification to a user
// @access  Admin
router.post('/users/:userId/notify', [authMiddleware, adminMiddleware], adminController.sendNotification);

module.exports = router;
