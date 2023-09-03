const sessionModel = require("../models/sessionModel");

// Create a new session when a user logs in
const createSession = async (userId, token) => {
    try {
        const session = new sessionModel({
            userId: userId,
            token: token,
        });
        await session.save();
    } catch (error) {
        throw error;
    }
};

// Remove a session when a user logs out or the token expires
const removeExistingSession = async (userData) => {
    try {
        const result = await sessionModel.deleteOne({
            userId: userData._id,
        });
    } catch (error) {
        console.error(`Error removing session for user with _id ${userData._id}: ${error.message}`);
        throw error;
    }
};

// Check if a session has expired
const isSessionExpired = async (token) => {
    try {
        const session = await sessionModel.findOne({ token }).exec();
        if (!session) {
            return true; // Token not found, consider it expired
        }
        return session.hasExpired();
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createSession,
    removeExistingSession,
    isSessionExpired,
};
