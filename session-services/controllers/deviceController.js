const deviceModel = require("../models/deviceModel");
const sessionModel = require("../models/sessionModel");

const createDeviceDetails = async (userId, deviceName, deviceId) => {
    try {
        const findDevice = await sessionModel.findOneAndUpdate({ userId: userId }, {
            deviceName: deviceName,
            deviceId: deviceId,
        });

        console.log(findDevice);
        
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Remove device details associated with a user
const removeDeviceDetails = async (userId) => {
    try {
        await deviceModel.updateMany({ userId: userId }, { isDeleted: true });
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports = {
    createDeviceDetails,
    removeDeviceDetails,
};
