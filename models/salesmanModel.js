const mongoose = require('mongoose');

// Define the schema for the salesman collection
const salesmanSchema = new mongoose.Schema({
    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Distributor',
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        postal_code: String,
    },
    date_of_birth: Date,
    hire_date: Date,
    sales_region: String,
}, { timestamps: true });


module.exports = mongoose.model('Salesman', salesmanSchema);
