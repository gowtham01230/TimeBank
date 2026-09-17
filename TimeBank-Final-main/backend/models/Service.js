
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    timeValue: { type: Number, required: true }, // in hours
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', ServiceSchema);