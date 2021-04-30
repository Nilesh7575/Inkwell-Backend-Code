const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const userChatSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserMaster'
    },
    FirmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FirmMaster'
    },
    ToUserIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserMaster'
    }],
    ChatMessage: {
        type: String
    },
    Longitude: {
        type: String
    },
    Latitude: {
        type: String
    },
    LocationDetail: {
        type: String
    },
    UploadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Uploads'
    },
    DeviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeviceMaster'
    },
    Deleted: {
        type: Boolean
    }
},
{
    timestamps: true,
});

userChatSchema.plugin(beautifyUnique);

module.exports = mongoose.Model('Uploads',userChatSchema);