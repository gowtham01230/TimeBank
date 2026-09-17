
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['Requested', 'Accepted', 'In Progress', 'Finished', 'Completed', 'Rejected'],
        default: 'Requested',
    },
    requesterConfirmed: { type: Boolean, default: false },
    providerConfirmed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', JobSchema);