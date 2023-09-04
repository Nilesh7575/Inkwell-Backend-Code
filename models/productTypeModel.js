const mongoose = require('mongoose');
const { Schema } = mongoose;

const productTypeSchema = new Schema({
    typeName: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('ProductType', productTypeSchema);
