const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);