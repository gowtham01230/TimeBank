

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const serviceController = require('../controllers/serviceController');

// @route   GET api/services/top
// @desc    Get top 5 rated services
// @access  Private
router.get('/top', authMiddleware, serviceController.getTopServices);

// @route   GET api/services
// @desc    Get all services
// @access  Private (Users must be logged in to see services)
router.get('/', authMiddleware, serviceController.getAllServices);

// @route   POST api/services
// @desc    Create a new service
// @access  Private
router.post(
    '/',
    [
        authMiddleware,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('description', 'Description is required').not().isEmpty(),
            check('category', 'Category is required').not().isEmpty(),
            check('timeValue', 'Time value must be a positive number').isFloat({ gt: 0 }),
        ],
    ],
    serviceController.createService
);

module.exports = router;