const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const loggerSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserMaster'
    },
    DeviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeviceMaster'
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
    MenuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuMaster'
    },
    Parameters: {
        type: String
    }
},
{
    timestamps: true,
});

loggerSchema.plugin(beautifyUnique);

module.exports = mongoose.Model('Logger',loggerSchema);