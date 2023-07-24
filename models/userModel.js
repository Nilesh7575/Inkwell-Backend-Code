const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        mobileNumber: {
            type: String,
            required: true,
        },
        otp: {
            type: String
        },
        profile: {
            address: {
                type: String,
            },
            aadhar: {
                type: String
            },
            panNumber: {
                type: String
            },
            DOB: {
                type: Date,
            },
        },
        userRole: {
            type: String,
            enum: ['RETAILER', 'DISTRIBUTOR', 'SALESMAN']
        },
        isSuperAdmin: {
            type: Boolean,
            default: false
        },
        deviceDetailes: {
            type: String
        },
        notificationToken: {
            type: String
        },
        isLoggedIn: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
