
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// @route   PUT api/users/me
// @desc    Update current user's profile
// @access  Private
router.put('/me', authMiddleware, userController.updateUserProfile);

module.exports = router;