const { validationResult } = require('express-validator');
const Job = require('../models/Job');
const Service = require('../models/Service');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Feedback = require('../models/Feedback');
const { sendNegativeFeedbackAlert } = require('../services/emailService');

// Get all jobs for the current user
exports.getUserJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            $or: [{ requester: req.user.id }, { provider: req.user.id }],
        })
            .populate('service', ['title', 'timeValue'])
            .populate('requester', ['name', 'averageRating', 'ratingCount'])
            .populate('provider', ['name', 'averageRating', 'ratingCount'])
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Request a service (create a job)
exports.requestService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.serviceId);
        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }

        if (service.provider.toString() === req.user.id) {
            return res.status(400).json({ msg: 'You cannot request your own service' });
        }

        const newJob = new Job({
            service: req.params.serviceId,
            requester: req.user.id,
            provider: service.provider,
        });

        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Update job status
exports.updateJobStatus = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ msg: 'Job not found' });
        if (job.provider.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        
        job.status = req.body.status;
        await job.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Confirm job completion
exports.confirmCompletion = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId).populate('service');
        if (!job) return res.status(404).json({ msg: 'Job not found' });

        const isRequester = job.requester.toString() === req.user.id;
        const isProvider = job.provider.toString() === req.user.id;
        if (!isRequester && !isProvider) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        if (isRequester) job.requesterConfirmed = true;
        if (isProvider) job.providerConfirmed = true;

        if (job.requesterConfirmed && job.providerConfirmed) {
            job.status = 'Completed';
            
            const amount = job.service.timeValue;
            const requester = await User.findById(job.requester);
            const provider = await User.findById(job.provider);

            requester.timeBalance -= amount;
            provider.timeBalance += amount;
            
            await requester.save();
            await provider.save();

            const transaction = new Transaction({
                job: job.id,
                fromUser: requester.id,
                toUser: provider.id,
                amount,
                description: `Time credit for job: ${job.service.title}`,
            });
            await transaction.save();
        }

        await job.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Submit feedback
exports.submitFeedback = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { rating, comment } = req.body;

    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ msg: 'Job not found' });
        if (job.status !== 'Completed') return res.status(400).json({ msg: 'Job is not completed yet' });

        const isRequester = job.requester.toString() === req.user.id;
        const isProvider = job.provider.toString() === req.user.id;
        if (!isRequester && !isProvider) return res.status(401).json({ msg: 'User not authorized' });

        const toUserId = isRequester ? job.provider : job.requester;
        const fromUserId = req.user.id;

        const existingFeedback = await Feedback.findOne({ job: job.id, fromUser: fromUserId });
        if (existingFeedback) return res.status(400).json({ msg: 'You have already submitted feedback for this job' });
        
        const newFeedback = new Feedback({
            job: job.id,
            fromUser: fromUserId,
            toUser: toUserId,
            rating,
            comment,
        });

        await newFeedback.save();

        // Recalculate average rating for the user who received feedback
        const allFeedbackForUser = await Feedback.find({ toUser: toUserId });
        const totalRating = allFeedbackForUser.reduce((acc, f) => acc + f.rating, 0);
        const averageRating = totalRating / allFeedbackForUser.length;

        await User.findByIdAndUpdate(toUserId, {
            averageRating: averageRating,
            ratingCount: allFeedbackForUser.length,
        });


        // --- NEGATIVE FEEDBACK ANALYSIS ---
        if (newFeedback.rating <= 2) {
            const reviewedUser = await User.findById(toUserId);
            const reviewer = await User.findById(fromUserId);
            // This is an async function but we don't need to wait for it.
            // Let it run in the background.
            sendNegativeFeedbackAlert(newFeedback, reviewedUser, reviewer, job);
        }

        res.json(newFeedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};
