const mongoose = require('mongoose');

// Create a schema for storing device details
const deviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    deviceId: {
        type: String,
        unique: true,
    },
    deviceName: {
        type: String,

    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);

