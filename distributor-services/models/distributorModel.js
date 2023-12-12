const mongoose = require("mongoose");

const distributorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpAttempts: {
      type: Number
    },
    companyName: {
      type: String,
    },
    profile: {
      address: {
        type: String,
      },
      aadhar: {
        type: String,
      },
      panNumber: {
        type: String,
      },
      DOB: {
        type: Date,
      },
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    notificationToken: {
      type: String,
    },
    isLoggedIn: {
      type: Boolean,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Distributor", distributorSchema);
