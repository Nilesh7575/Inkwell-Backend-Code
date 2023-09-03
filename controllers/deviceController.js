const deviceModel = require("../models/deviceModel");

const createDeviceDetails = async (userId, deviceName, deviceId) => {
    try {
        await deviceModel.create({
            userId: userId,
            deviceName: deviceName,
            deviceId: deviceId,
        });
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Remove device details associated with a user
const removeDeviceDetails = async (userId) => {
    try {
        await deviceModel.deleteOne({ userId: userId });
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports = {
    createDeviceDetails,
    removeDeviceDetails,
};
