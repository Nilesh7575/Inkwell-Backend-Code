const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const userGroupMasterSchema = new mongoose.Schema({
    UserGroupName: {
        type: String,
        unique: true,
        required: true
    },
},{
    timestamps: true,
});

userGroupMasterSchema.plugin(beautifyUnique);

module.exports = mongoose.model('UserGroupMaster',userGroupMasterSchema);
