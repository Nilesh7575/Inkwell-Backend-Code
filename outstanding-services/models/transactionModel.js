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
    }
)


module.exports = mongoose.model('transactionTable', transactionSchema)