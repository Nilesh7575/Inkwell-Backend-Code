const distributorModel = require("../models/distributorModel");
const deviceModel = require("../../session-services/models/deviceModel");
const sessionModel = require("../../session-services/models/sessionModel");
const otpGenerator = require("otp-generator");
const { sendMessageOtp } = require("../../helper/whatsAppService");
const { sendMsg, sendSMS } = require("../../helper/smsService");
const { createSession, removeExistingSession, isSessionExpired, } = require("../../session-services/controllers/sessionController");
const { createDeviceDetails, removeDeviceDetails, } = require("../../session-services/controllers/deviceController");
const distributorStoreModel = require("../models/distributorStoreModel");
const { generateTokens } = require("../../helper/tokenGenerate");

const createDistributor = async (req, res) => {
    try {
        const { fullName, email, companyName, mobileNumber, businessCategory, deviceName, deviceId } = req.body;

        const findEmail = await distributorModel.findOne({ email: email })

        if (findEmail) {
            return res
                .status(200)
                .send({ success: false, emailExist: true, message: "Email ID already exist" });
        }
        let profile = {
            address: '',
            aadhar: '',
            panNumber: '',
            DOB: ''
        }

        const userData = await distributorModel.findOneAndUpdate({ mobileNumber: mobileNumber }, { fullName, email, companyName, profile: profile });

        const newStore = await distributorStoreModel.create({ distrubutorId: userData._id, store_name: companyName, businessCategory: businessCategory });
        const addStoreId = await distributorModel.findByIdAndUpdate(userData._id, { $push: { stores: newStore._id } });

        const { accessToken, refreshToken, expiresIn } = generateTokens(userData._id, deviceName, deviceId);

        createDeviceDetails(userData._id, deviceName, deviceId);

        console.log(userData);
        if (!userData) {
            return res
                .status(200)
                .send({ success: false, message: "Failed to create" });
        }
        return res
            .status(201)
            .send({
                success: true,
                message: "Successfully created!",
                token: accessToken,
                refreshToken: refreshToken,
                userData: userData,
            });
    } catch (err) {
        console.log(err.message);
    }
};

const cleanupOldAttempts = async (userId) => {
    await sessionModel.updateMany(
        { userId, updatedAt: { $lt: new Date(Date.now() - 2 * 60 * 1000) } },
        { $set: { otpAttempts: 0 } }
    );
};

const sendOTP = async (req, res) => {
    try {
        const { mobileNumber, deviceId, deviceName } = req.body;

        if (!mobileNumber) {
            return res.status(200).json({
                success: false,
                incorrectNumber: true,
                message: "Invalid mobile number. Please enter a valid mobile number.",
            });
        }

        const numericRegex = /^[0-9]+$/;
        if (!numericRegex.test(mobileNumber)) {
            return res.status(200).json({
                success: false,
                incorrectNumber: true,
                message: "Invalid mobile number. Please enter a valid mobile number.",
            });
        }

        if (mobileNumber.length !== 10) {
            return res.status(200).json({
                success: false,
                incorrectNumber: true,
                message: "Invalid mobile number. Please enter a valid mobile number.",
            });
        }

        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobileNumber)) {
            return res.status(200).json({
                success: false,
                incorrectNumber: true,
                message: "Invalid mobile number. Please enter a valid mobile number.",
            });
        }


        let userData = await distributorModel.findOne({ mobileNumber: mobileNumber });

        if (!userData) {
            userData = await distributorModel.create({ mobileNumber: mobileNumber });
        }

        // Cleanup old attempts before checking recent attempts
        await cleanupOldAttempts(userData._id);

        // Check if the user has attempted more than 4 times within the last 15 minutes
        const recentAttempts = await sessionModel.countDocuments({
            userId: userData._id,
            updatedAt: { $gte: new Date(Date.now() - 2 * 60 * 1000) },
            otpAttempts: { $gte: 3 },
        });

        if (recentAttempts > 0) {
            return res.status(200).json({
                success: false,
                requestOverload: true,
                waitTime: 30,
                message: "Too many OTP attempts. Please try again after 30 minutes.",
            });
        }

        const otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        console.log("SentOTP Function", otp);

        // if (userData) {
        //     await removeExistingSession(userData);
        //     // await removeDeviceDetails(userData._id);
        // }
        const findSession = await sessionModel.findOne({ userId: userData._id, });
        if (!findSession) {
            const saveOtp = await sessionModel.create({
                userId: userData._id,
                otp: otp,
                otpAttempts: 1,
            });
        } else {
            const updateSession = await sessionModel.findOneAndUpdate({ userId: userData._id }, {
                otp: otp,
                otpAttempts: findSession.otpAttempts + 1
            });
        }

        const otpMsg = await sendSMS(mobileNumber, otp);

        if (!otpMsg.data) {
            return res.status(500).send({ success: false, message: "Otp Not send to your number" });
        }

        createDeviceDetails(userData._id, deviceName, deviceId);

        return res.status(200).send({
            success: true,
            otp: otp,
            messsge: "An OTP has been sent to your registered number!",
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { mobileNumber, otp, deviceName, deviceId } = req.body;
        const userData = await distributorModel.findOne({ mobileNumber: mobileNumber }).populate('stores')

        if (!userData) {
            return res.status(200).send({
                success: false,
                message: "User not found",
            });
        }
        const findSession = await sessionModel.findOne({ userId: userData._id, });

        if (findSession.otp === otp) {
            // Check if OTP is expired (3 minutes)
            const otpExpirationTime = 3 * 60 * 1000; // in milliseconds
            const currentTime = new Date().getTime();

            if (currentTime - findSession.updatedAt.getTime() > otpExpirationTime) {
                return res.status(200).send({
                    success: false,
                    otpExpired: true,
                    message: "OTP has expired. Please request a new OTP.",
                });
            }

            // Reset OTP attempts after successful verification
            await sessionModel.findOneAndUpdate({ userId: userData._id }, { $set: { otpAttempts: 0 } });

            // // Remove existing session and device details
            // await removeExistingSession(userData);
            // await removeDeviceDetails(userData._id);

            const { accessToken, refreshToken, expiresIn } = generateTokens(userData._id, deviceName, deviceId);

            createDeviceDetails(userData._id, deviceName, deviceId);

            let responseData;

            let userExist = userData.email && userData.companyName ? true : false;

            if (!userExist) {
                responseData = {
                    success: true,
                    userExist: userExist,
                    message: "Verify successfully",
                }
            } else {
                responseData = {
                    success: true,
                    userExist: userExist,
                    token: accessToken,
                    refreshToken: refreshToken,
                    message: "Verify successfully",
                }
            }


            return res.status(200).send(responseData);

        } else {
            return res.status(200).send({
                success: false,
                invalidOtp: true,
                message: "Sorry Invalid OTP! Please Verify Mobile Number",
            });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            success: false,
            message: `Internal server error:${err.message}`,
        });
    }
};

const logout = async (req, res) => {
    try {
        const { userId, mobileNumber } = req.body;
        await removeExistingSession(userId, mobileNumber);
        // await removeDeviceDetails(userId);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Controller function to get all users
async function getAllDistributor(req, res) {
    try {
        const users = await distributorModel.find({
            isDeleted: false,
            fullName: { $exists: true },
            email: { $exists: true },
            companyName: { $exists: true }
        });
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching users." });
    }
}

// Controller function to get a single user by ID
async function getDistributorById(req, res) {
    const { id } = req.params;
    try {
        const user = await distributorModel.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching user." });
    }
}

// Controller function to update a user by ID
async function updateDistributor(req, res) {
    const { userId } = req.params;
    console.log(userId)
    try {
        const updatedUser = await distributorModel.findByIdAndUpdate(userId, req.body, { new: true, });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ error: "Error updating user." });
    }
}

// Controller function to delete a user by ID
async function deleteDistributor(req, res) {
    const { userId } = req.params;
    try {
        const deletedUser = await distributorModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        return res.status(500).json({ error: "Error deleting user." });
    }
}


module.exports = {
    createDistributor,
    sendOTP,
    verifyOTP,
    logout,
    getAllDistributor,
    getDistributorById,
    updateDistributor,
    deleteDistributor,
};
