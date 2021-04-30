const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const uploadsSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserMaster'
    },
    UploadLink: {
        type: String
    },
    SharedWith: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserMaster'
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
    Deleted: {
        type: Boolean
    },
    DeviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeviceMaster'
    }
},
{
    timestamps: true,
});

uploadsSchema.plugin(beautifyUnique);

module.exports = mongoose.Model('Uploads',uploadsSchema);