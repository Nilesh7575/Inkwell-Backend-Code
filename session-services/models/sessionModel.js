const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    otp: {
        type: String,
    },
    otpAttempts: {
        type: Number
    },
    deviceId: {
        type: String,
        unique: true,
    },
    deviceName: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    refreshTokenValidUntil: {
        type: Date,
    },
}, { timestamps: true });

// Create and export the Session model
module.exports = mongoose.model('Session', sessionSchema);
