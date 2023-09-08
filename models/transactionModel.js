const mongoose = require("mongoose")


const object_id = mongoose.Schema.Types.ObjectId

const transactionSchema = new mongoose.Schema(
    {
        orderId: {
            type: object_id,
            ref: "order"
        },
        distributerStoreId: {
            type: object_id,
            ref: "distributerStoreSchema"
        },
        salesmanId: {
            type: object_id,
            ref: "salesmanSchema"
        },
        retailerId: {
            type: object_id,
            ref: "retailerSchema"
        },
        retailerStoreId: {
            type: object_id,
            ref: "retailerStoreSchema"
        },
        totalAmount: {
            type: Number,
            required: true
        },
        pendingAmount: {
            type: Number,
            required: true
        },
        transactionStatus: {
            type: String,
            enum: ['SUCCESSFUL','FAILED', 'PENDING'],
            required: true
        },
        transactionDate: {
            type: Date,
            required: true
        },
        transactionId: {
            type: String
        },
        paymentMode: {
            type: String,
        },
        paymentGateway: {
            type: String,
        },
    }
)