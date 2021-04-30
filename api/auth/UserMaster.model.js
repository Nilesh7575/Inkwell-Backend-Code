const mongoose = require("mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const userMasterSchema = new mongoose.Schema(
  {
    userLoginId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
    },
    DOB: {
      type: Date,
    },
    userGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserGroupMaster",
    },
    address: {
      type: String,
    },
    FirmID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FirmMaster",
      },
    ],
    fcm_token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userMasterSchema.plugin(beautifyUnique);

module.exports = mongoose.model("UserMaster", userMasterSchema);
