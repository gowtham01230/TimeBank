
const User = require('../models/User');

exports.updateUserProfile = async (req, res) => {
    const { name, phone, skills, availableHours, profilePhoto } = req.body;

    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (phone) userFields.phone = phone;
    if (skills) userFields.skills = skills;
    if (availableHours) userFields.availableHours = availableHours;
    if (profilePhoto) userFields.profilePhoto = profilePhoto;

    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: userFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};