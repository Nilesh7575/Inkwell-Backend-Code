const mongoose = require("mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const NotificationSchema = mongoose.Schema(
  {
    userId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserMaster",
      },
    ],
    deviceId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeviceMaster",
      },
    ],
    message: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.plugin(beautifyUnique);

module.exports = mongoose.model("Notifications", NotificationSchema);
