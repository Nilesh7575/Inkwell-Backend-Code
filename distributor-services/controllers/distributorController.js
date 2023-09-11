const userModel = require("../models/distributorModel");
const deviceModel = require("../../session-services/models/deviceModel");
const sessionModel = require("../../session-services/models/sessionModel");
const otpGenerator = require("otp-generator");
const { sendMessageOtp } = require("../../helper/whatsAppService");
const { sendMsg } = require("../../helper/smsService");
const jwt = require("jsonwebtoken");
const { createSession, removeExistingSession, isSessionExpired, } = require("../../session-services/controllers/sessionController");
const { createDeviceDetails, removeDeviceDetails, } = require("../../session-services/controllers/deviceController")

const createDistributor = async (req, res) => {
    try {
        const { fullName, email, mobileNumber, profile, userRole } = req.body;
        const { } = profile;
        const userData = await userModel.findOneAndUpdate(
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
        const { mobileNumber, deviceIdentifier, deviceName } = req.body;

        const otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        console.log("SentOTP Function", otp);

        let userData = await userModel.findOne({ mobileNumber: mobileNumber });

        if (userData) {
            await removeExistingSession(userData);
            await removeDeviceDetails(userData._id);
        }
        if (userData) {
            const updateOtp = await userModel.findOneAndUpdate(
                { mobileNumber: mobileNumber },
                { otp: otp },
                { upsert: true, new: true }
            );
            userData = updateOtp
        } else {
            const saveOtp = await userModel.create({
                mobileNumber: mobileNumber,
                otp: otp
            })
            userData = saveOtp
        }

        if (!userData) {
            return res.status(400).send({
                success: false,
                userRegisterd: false,
                message: "error Not Found",
            });
        }

        let userExist = !(userData && !userData.email && !userData.fullName);
        const otpMsg = await sendMsg(mobileNumber, otp);
        const otpWhatsApp = await sendMessageOtp(mobileNumber, otp);
        console.log("otp send response", otpWhatsApp, otpMsg);

        if (!otpMsg.sid) {
            return res
                .status(500)
                .send({ success: false, message: "Otp Not send to your number" });
        }

        createDeviceDetails(userData._id, deviceName, deviceIdentifier);

        return res.status(200).send({
            success: true,
            userRegisterd: userExist,
            messsge: "An OTP has been sent to your registered number!",
        });
    } catch (err) {
        console.log(err.message);
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { mobileNumber, otp, deviceIdentifier } = req.body;
        const userData = await userModel.findOne({ mobileNumber: mobileNumber });
        console.log(req.body, userData);

        if (userData.otp === otp) {
            await removeExistingSession(userData);
            // await removeDeviceDetails(userData._id);

            const token = generateToken(userData._id);
            await createSession(userData._id, token);

            let userExist = userData.email && userData.fullName ? true : false;

            return res.status(200).send({
                success: true,
                userRegistered: userExist,
                token: token,
                message: "Verify successfully",
            });
        } else {
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
        await removeExistingSession(token);

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
        const users = await userModel.find({
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
        const user = await userModel.findById(id);
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
        const updatedUser = await userModel.findByIdAndUpdate(userId, req.body, {
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
        const deletedUser = await userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        return res.status(500).json({ error: "Error deleting user." });
    }
}

function generateToken(userId) {
    const secretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ userId }, secretKey, { expiresIn: "8h" });
    return token;
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
