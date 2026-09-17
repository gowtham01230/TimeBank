const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['warning', 'info', 'job_update'],
        default: 'info',
    },
    isRead: { type: Boolean, default: false },
    link: { type: String }, // Optional link, e.g., to a job page
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', NotificationSchema);
