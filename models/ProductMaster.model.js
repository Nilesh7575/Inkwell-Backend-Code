const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const productMasterSchema = new mongoose.Schema({
    ProductName: {
        type: String,
        unique: true,
    },
    Description: {
        type: String,
    },
    Url: {
        type: String,
    },
    Image: [{
        type: String
    }],
    Price: {
        type: Number,
    }
},{
    timestamps: true,
});

productMasterSchema.plugin(beautifyUnique);


module.exports = mongoose.model('ProductMaster',productMasterSchema);