const mongoose = require("mongoose")
const object_id = mongoose.Schema.Types.ObjectId

const transactionSchema = new mongoose.Schema(
    {
        orderId: {
            type: object_id,
            ref: "order"
        },
        retailerId: {
            type: object_id,
            ref: "retailerSchema"
        },
        transactionStatus: {
            type: String,
            enum: ['SUCCESSFUL','FAILED', 'PENDING'],
            default: 'PENDING'
        },
        amount: {
            type: Number,
            required: true
        },
        bankName: {
            type: String,
        },
        accountNo: {
            type: String
        },
        chequeNo: {
            type: Number
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
            enum: ['UPI','CHEQUE', 'CASH'],
            required: true
        },
    }
)


module.exports = mongoose.model('transactionTable', transactionSchema)