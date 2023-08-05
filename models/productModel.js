const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;


const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    _MFRName: {
        type: String,
        required: true,
        trim: true,
    },
    productType: {
        type: objectId,
        ref: 'ProductType',
        required: true,
        index: true,
    },
    category: {
        type: objectId,
        ref: 'Category',
        required: true,
        index: true,
    },
    brandId: {
        type: objectId,
        ref: 'Brand',
        required: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: [{
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value.startsWith('http://') || value.startsWith('https://');
            },
            message: 'Invalid image URL format',
        },
    }],
    variants: [
        {
            quantity: {
                type: Number,
                required: true,
            },
            weight: {
                type: Number,
            },
            capacity: {
                type: Number,
            },
            packingSize: {
                type: Number,
            },
            _MRP: {
                type: Number,
                required: true,
            },
            salesPrice: {
                type: Number,
                required: true,
            },
            _id: false
        }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

productSchema.index({ productName: 1, brandId: 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema);
