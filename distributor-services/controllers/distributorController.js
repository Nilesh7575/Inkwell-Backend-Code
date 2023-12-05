const distributorModel = require("../models/distributorModel");
const deviceModel = require("../../session-services/models/deviceModel");
const sessionModel = require("../../session-services/models/sessionModel");
const otpGenerator = require("otp-generator");
const { sendMessageOtp } = require("../../helper/whatsAppService");
const { sendMsg, sendSMS } = require("../../helper/smsService");
const jwt = require("jsonwebtoken");
const { createSession, removeExistingSession, isSessionExpired, } = require("../../session-services/controllers/sessionController");
const { createDeviceDetails, removeDeviceDetails, } = require("../../session-services/controllers/deviceController");
const distributorStoreModel = require("../models/distributorStoreModel");

const createDistributor = async (req, res) => {
    try {
        const { fullName, email, mobileNumber, profile, userRole } = req.body;
        const { } = profile;
        const userData = await distributorModel.findOneAndUpdate(
            { mobileNumber: mobileNumber },
            req.body,
            { new: true }
        );
        if (!userData) {
            return res
                .status(400)
                .send({ success: false, message: "Failed to create" });
        }
        return res
            .status(201)
            .send({
                success: true,
                message: "Successfully created!",
                data: userData,
            });
    } catch (err) {
        console.log(err.message);
    }
};

const sendOTP = async (req, res) => {
    try {
        const { mobileNumber, deviceId, deviceName } = req.body;

        // Check if the user has attempted more than 4 times within the last 15 minutes
        const recentAttempts = await distributorModel.countDocuments({
            mobileNumber: mobileNumber,
            updatedAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) },
            otpAttempts: { $gte: 4 },
        });

        if (recentAttempts > 0) {
            return res.status(429).json({
                success: false,
                message: "Too many OTP attempts. Please try again after 30 minutes.",
            });
        }

        const otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        console.log("SentOTP Function", otp);

        let userData = await distributorModel.findOne({ mobileNumber: mobileNumber });

        if (userData) {
            await removeExistingSession(userData);
            await removeDeviceDetails(userData._id);
        }
        if (userData) {
            const updateOtp = await distributorModel.findOneAndUpdate(
                { mobileNumber: mobileNumber },
                { otp: otp, $inc: { otpAttempts: 1 } },
                { upsert: true, new: true }
            );
            userData = updateOtp;
        } else {
            const saveOtp = await distributorModel.create({
                mobileNumber: mobileNumber,
                otp: otp,
                otpAttempts: 1,
            });
            userData = saveOtp;
        }

        if (!userData) {
            return res.status(400).send({
                success: false,
                userRegisterd: false,
                message: "error Not Found",
            });
        }

        let userExist = !(userData && !userData.email && !userData.fullName);
        const otpMsg = await sendSMS(mobileNumber, otp);

        if (!otpMsg.data) {
            return res.status(500).send({ success: false, message: "Otp Not send to your number" });
        }

        createDeviceDetails(userData._id, deviceName, deviceId);

        return res.status(200).send({
            success: true,
            userRegisterd: userExist,
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
        const userData = await distributorModel.findOne({ mobileNumber: mobileNumber });

        if (!userData) {
            return res.status(400).send({
                success: false,
                message: "User not found",
            });
        }

        if (userData.otp === otp) {
            // Check if OTP is expired (15 minutes)
            const otpExpirationTime = 15 * 60 * 1000; // in milliseconds
            const currentTime = new Date().getTime();

            if (currentTime - userData.updatedAt.getTime() > otpExpirationTime) {
                return res.status(400).send({
                    success: false,
                    message: "OTP has expired. Please request a new OTP.",
                });
            }

            // Reset OTP attempts after successful verification
            await distributorModel.findByIdAndUpdate(userData._id, { $set: { otpAttempts: 0 } });

            // Remove existing session and device details
            await removeExistingSession(userData);
            await removeDeviceDetails(userData._id);

            const { accessToken, refreshToken, expiresIn } = generateTokens(userData._id, deviceName, deviceId);

            createDeviceDetails(userData._id, deviceName, deviceId);

            let userExist = userData.email && userData.companyName ? true : false;
            let stores = [];
            let userDetails = '';
            if (userExist) {
                userDetails=userData;
                stores = await distributorStoreModel.find({ distributorId: userData._id });
            }

            return res.status(200).send({
                success: true,
                token: accessToken,
                refreshToken: refreshToken,
                expiresIn: expiresIn,
                userExist: userExist,
                userDetails: userDetails,
                stores: stores,
                subscription: "",
                message: "Verify successfully",
            });
        } else {
            // Increment OTP attempts after failed verification
            await distributorModel.findByIdAndUpdate(userData._id, { $inc: { otpAttempts: 1 } });

            return res.status(400).send({
                success: false,
                message: "Sorry Invalid OTP! Please Verify Mobile Number",
            });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

const logout = async (req, res) => {
    try {
        const { userId, token } = req.body;
        // await removeExistingSession(token);
        await removeDeviceDetails(userId);

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
    try {
        const updatedUser = await distributorModel.findByIdAndUpdate(userId, req.body, {
            new: true,
        });
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


const generateToken = (userId, deviceName, deviceId, isRefreshToken, expiresIn) => {
    const secretKey = process.env.JWT_SECRET_KEY;

    const payload = {
        userId,
        deviceName,
        deviceId,
    };

    const options = {
        expiresIn: isRefreshToken ? expiresIn : '8h',
    };

    // Sign the token using the secret key and options
    const token = jwt.sign(payload, secretKey, options);
    return token;
}

// Function to generate both access token, refresh token, and expiration time
const generateTokens = (userId, deviceName, deviceId) => {
    // Set the expiration time for the access token (e.g., 8 hours)
    const accessTokenExpiresIn = 8 * 60 * 60; // in seconds

    // Set the expiration time for the refresh token (e.g., 7 days)
    const refreshTokenExpiresIn = 24 * 60 * 60; // in seconds

    // Generate an access token with the specified expiration time
    const accessToken = generateToken(userId, deviceName, deviceId, false, accessTokenExpiresIn);

    // Generate a refresh token with the specified expiration time
    const refreshToken = generateToken(userId, deviceName, deviceId, true, refreshTokenExpiresIn);

    return { accessToken, refreshToken, expiresIn: accessTokenExpiresIn };
};


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
