
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const jobController = require('../controllers/jobController');
const { check } = require('express-validator');

// @route   GET api/jobs
// @desc    Get all jobs for the current user
// @access  Private
router.get('/', authMiddleware, jobController.getUserJobs);

// @route   POST api/jobs/request/:serviceId
// @desc    Request a service (create a job)
// @access  Private
router.post('/request/:serviceId', authMiddleware, jobController.requestService);

// @route   PUT api/jobs/:jobId/status
// @desc    Update a job's status
// @access  Private
router.put(
    '/:jobId/status',
    [
        authMiddleware,
        check('status', 'A valid status is required').isIn(['Accepted', 'In Progress', 'Finished', 'Rejected']),
    ],
    jobController.updateJobStatus
);

// @route   POST api/jobs/:jobId/confirm
// @desc    Confirm job completion
// @access  Private
router.post('/:jobId/confirm', authMiddleware, jobController.confirmCompletion);

// @route   POST api/jobs/:jobId/feedback
// @desc    Submit feedback for a job
// @access  Private
router.post(
    '/:jobId/feedback',
    [
        authMiddleware,
        check('rating', 'Rating is required and must be between 1 and 5').isInt({ min: 1, max: 5 }),
    ],
    jobController.submitFeedback
);

module.exports = router;