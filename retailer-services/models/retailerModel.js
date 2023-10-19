const mongoose = require("mongoose");

const retailerSchema = new mongoose.Schema({
    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Distributor",
        required: true,
    },
    distributorStoreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: " Distributorstore",
        required: true,
    },
    fullName: {
        type: String,
    },
    email: {
        type: String,
    },
    mobileNumber: {
        type: String,
    },
    surplusAmount: {
        type: Number,
        default: 0,
    }

}, { timestamps: true })

module.exports = mongoose.model("Retailer", retailerSchema)