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
});

module.exports  = mongoose.model('Device', deviceSchema);

