const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    distrubutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Distributor",
        required: true,
    },
    businessCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessCategory",
    },
    store_name: {
        type: String,
        required: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        postal_code: String,
    },
    phone_number: {
        type: String,
    },
    email: {
        type: String,
    },
    gst_number: {
        type: String,
    },
    pan: {
        type: String,
    },
    vat_number: {
        type: String,
    },
    business_license_number: {
        type: String,
    },
    business_registration_number: {
        type: String,
    },
    tax_exempt_status: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });

module.exports = mongoose.model('Distributorstore', storeSchema);

