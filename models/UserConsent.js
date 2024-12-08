const mongoose = require('mongoose');

const userConsentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['terms', 'privacy', 'cookies', 'coach-agreement'],
        required: true
    },
    version: {
        type: String,
        required: true
    },
    acceptedAt: {
        type: Date,
        default: Date.now
    },
    ipAddress: String,
    userAgent: String
});

module.exports = mongoose.model('UserConsent', userConsentSchema); 