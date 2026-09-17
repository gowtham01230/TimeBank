const User = require('../models/User');
const Notification = require('../models/Notification');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Update a user's details (status or time balance)
exports.updateUser = async (req, res) => {
    const { status, timeBalance } = req.body;

    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (status) {
            if (user.role === 'admin') {
                return res.status(400).json({ msg: 'Cannot change status of an admin account' });
            }
            user.status = status;
        }

        if (timeBalance !== undefined) {
            user.timeBalance = timeBalance;
        }

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Send a notification to a user
exports.sendNotification = async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ msg: 'Message is required' });
    }

    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const newNotification = new Notification({
            user: user.id,
            message: message,
            type: 'warning', // Admin notifications are always warnings for now
        });

        await newNotification.save();
        res.json(newNotification);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};
