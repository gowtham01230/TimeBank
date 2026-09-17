const { validationResult } = require('express-validator');
const Service = require('../models/Service');
const User = require('../models/User');

// Get all services, populated with provider info
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find()
            .populate('provider', ['name', 'profilePhoto', 'averageRating', 'ratingCount'])
            .sort({ createdAt: -1 });
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get top 5 rated services
exports.getTopServices = async (req, res) => {
    try {
        const topServices = await Service.aggregate([
            {
                $lookup: {
                    from: 'users', // The collection name for the User model
                    localField: 'provider',
                    foreignField: '_id',
                    as: 'providerInfo'
                }
            },
            {
                $unwind: '$providerInfo' // Deconstructs the providerInfo array to a single object
            },
            {
                $sort: {
                    'providerInfo.averageRating': -1,
                    'providerInfo.ratingCount': -1,
                    'createdAt': -1
                }
            },
            {
                $limit: 5
            },
            {
                $project: { // Reshape the output to match what the frontend expects
                    _id: 1,
                    title: 1,
                    description: 1,
                    category: 1,
                    timeValue: 1,
                    createdAt: 1,
                    provider: {
                        _id: '$providerInfo._id',
                        name: '$providerInfo.name',
                        profilePhoto: '$providerInfo.profilePhoto',
                        averageRating: '$providerInfo.averageRating',
                        ratingCount: '$providerInfo.ratingCount'
                    }
                }
            }
        ]);
        res.json(topServices);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Create a new service
exports.createService = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, timeValue } = req.body;

    try {
        const newService = new Service({
            title,
            description,
            category,
            timeValue,
            provider: req.user.id,
        });

        const service = await newService.save();
        res.json(service);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};