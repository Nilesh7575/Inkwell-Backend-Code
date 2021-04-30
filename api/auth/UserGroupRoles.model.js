const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const userGroupRolesSchema = new mongoose.Schema({
    UserGroupID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserGroupMaster'
    },
    ProductID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductMaster'
    },
    MenuID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuMaster'
    },
    CanView: {
        type: Boolean,
    }
},
{
    timestamps: true,
});

userGroupRolesSchema.plugin(beautifyUnique);

module.exports = mongoose.model('UserGroupRoles',userGroupRolesSchema);
