const deviceModel = require("../models/deviceModel");

const createDeviceDetails = async (userId, deviceName, deviceId) => {
    try {
        const findDevice = await deviceModel.find({ deviceId: deviceId })
        console.log(findDevice.length)

        if (findDevice.length > 0) {
            await deviceModel.findOneAndUpdate({ deviceId: deviceId }, { isDeleted: false })
        } else {
            await deviceModel.create({
                userId: userId,
                deviceName: deviceName,
                deviceId: deviceId,
            });
        }
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
