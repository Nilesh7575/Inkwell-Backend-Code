const { database } = require("firebase-admin");
const userModel = require("../models/userModel");
const otpGenerator = require('otp-generator')


const createUser = async (req, res, next) => {
    try {
        const { fullName, email, mobileNumber, profile, userRole } = req.body;
        const { } = profile;
        const data = await userModel.findOneAndUpdate({ mobileNumber: mobileNumber }, req.body, { new: true })
        if (!data) {
            return res.status(400).send({ success: false, message: 'Failed to create' })
        }
        return res.status(201).send({ success: true, message: "Successfully created!", data: data });
    } catch (err) {
        console.log(err.message)
    }
}

const sendOTP = async (req, res, next) => {
    try {
        const { mobileNumber } = req.body;
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const storeOtp = await userModel.findOneAndUpdate({ mobileNumber: mobileNumber },
            { otp: otp }, { upsert: true, }, { new: true });
        if (!storeOtp) {
            return res.status(400).send({ success: false, userRegisterd: false, message: 'error Not Found' });
        }
        let userExist = storeOtp.email && storeOtp.fullName;
        const otpSend = sendMessageOtp(mobileNumber, otp);
        if (!otpSend) {
            return res.status(500).send({ success: false, message: 'Otp Not send to your number' });
        }
        return res.status(200).send({ success: true, userRegisterd: userExist, messsge: 'An OTP has been sent to your registered number!' })
    } catch (err) {
        console.log(err.message);
    }
}
const verifyOTP = async (req, res, next) => {
    try {
        const { mobileNumber, otp } = req.body;
        const data = await userModel.findOne({ mobileNumber: mobileNumber });

        if (data.otp == otp) {
            return res.status(400).send({ success: false, message: 'Sorry Invalid OTP! Please Verify Mobile Number' })
        }
        let userExist = data.email && data.fullName;
        return res.status(200).send({ success: true, userRegisterd: userExist, message: 'verify successfully' })
    }
    catch (err) {
        console.log(err.message);
    }
}



module.exports = { createUser, sendOTP, verifyOTP }