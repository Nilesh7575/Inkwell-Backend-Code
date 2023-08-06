const userModel = require("../models/userModel");
const otpGenerator = require("otp-generator");
const { sendMessageOtp } = require("../helper/whatsAppService");

const createUser = async (req, res) => {
    try {
        const { fullName, email, mobileNumber, profile, userRole } = req.body;
        const { } = profile;
        const data = await userModel.findOneAndUpdate(
            { mobileNumber: mobileNumber },
            req.body,
            { new: true }
        );
        if (!data) {
            return res
                .status(400)
                .send({ success: false, message: "Failed to create" });
        }
        return res
            .status(201)
            .send({ success: true, message: "Successfully created!", data: data });
    } catch (err) {
        console.log(err.message);
    }
};

const sendOTP = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        const otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        console.log("SentOTP Function", otp);
        const storeOtp = await userModel.findOneAndUpdate(
            { mobileNumber: mobileNumber },
            { otp: otp },
            { upsert: true, new: true }
        );
        if (!storeOtp) {
            return res
                .status(400)
                .send({
                    success: false,
                    userRegisterd: false,
                    message: "error Not Found",
                });
        }
        let userExist = storeOtp.email && storeOtp.fullName;
        const otpSend = await sendMessageOtp(mobileNumber, otp);
        console.log("whats App response", otpSend);
        if (otpSend.status !== 200) {
            return res
                .status(500)
                .send({ success: false, message: "Otp Not send to your number" });
        }
        return res
            .status(200)
            .send({
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
        const { mobileNumber, otp } = req.body;
        const data = await userModel.findOne({ mobileNumber: mobileNumber });
        // console.log(otp,data)
        if (data.otp !== otp) {
            return res
                .status(400)
                .send({
                    success: false,
                    message: "Sorry Invalid OTP! Please Verify Mobile Number",
                });
        }
        let userExist = data.email && data.fullName ? true : false;
        console.log(data.email, data.fullName);
        return res
            .status(200)
            .send({
                success: true,
                userRegisterd: userExist,
                message: "verify successfully",
            });
    } catch (err) {
        console.log(err.message);
    }
};

// Controller function to get all users
async function getAllUsers(req, res) {
    try {
        const users = await userModel.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching users." });
    }
}

// Controller function to get a single user by ID
async function getUserById(req, res) {
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
async function updateUserById(req, res) {
    const { id } = req.params;
    try {
        const updatedUser = await userModel.findByIdAndUpdate(id, req.body, {
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
async function deleteUserById(req, res) {
    const { id } = req.params;
    try {
        const deletedUser = await userModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        return res.status(500).json({ error: "Error deleting user." });
    }
}

module.exports = {
    createUser,
    sendOTP,
    verifyOTP,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
};
