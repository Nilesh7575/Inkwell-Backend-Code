const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const DeviceSchema = new mongoose.Schema({
    IMEI: {
        type: String
    },
    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserMaster'
    },
    TokenId: {
        type: String
    },
    DeviceName: {
        type: String
    },
    DeviceDetail: {
        type: String
    }
},
{
    timestamps: true,
});

DeviceSchema.plugin(beautifyUnique);

module.exports = mongoose.Model('DeviceMaster',DeviceSchema);