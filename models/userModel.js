const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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
    userRole: {
      type: String,
      enum: ["DISTRIBUTOR", "SALESMAN", "RETAILER"],
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

module.exports = mongoose.model("User", userSchema);
