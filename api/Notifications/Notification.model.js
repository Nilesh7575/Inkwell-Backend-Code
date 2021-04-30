const mongoose = require("mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const NotificationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserMaster",
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeviceMaster",
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  },
  additionalInfo: {
    image: {
      type: String,
    },
    clickAction: {
      type: String,
    },
  },
  actionStatus: {
    type: Boolean,
  },
});
