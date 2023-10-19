const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    tokenIssueAt: {
        type: String,
        required: true,
    },

}, { timestamps: true });

// Function to check if a session has expired
sessionSchema.methods.hasExpired = function () {
    // Define your session expiration time (e.g., 1 hour)
    const sessionExpirationTimeInMs = 60 * 5 * 1000;

    const currentTime = new Date();
    const sessionStartTime = new Date(this.createdAt);

    return currentTime - sessionStartTime > sessionExpirationTimeInMs;
};

// Create and export the Session model
module.exports = mongoose.model('Session', sessionSchema);
