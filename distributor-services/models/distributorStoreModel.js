const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Distributor",
        required: true,
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
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    gst_number: {
        type: String,
        required: true,
    },
    pan: {
        type: String,
        required: true,
    },
    vat_number: {
        type: String,
        required: true,
    },
    business_license_number: {
        type: String,
        required: true,
    },
    business_registration_number: {
        type: String,
        required: true,
    },
    tax_exempt_status: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });

module.exports = mongoose.model('Distributorstore', storeSchema);

