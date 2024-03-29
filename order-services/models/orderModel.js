const mongoose = require("mongoose")
const object_id = mongoose.Schema.Types.ObjectId


const orderSchema = mongoose.Schema(
    {
        distributorId: {
            type: object_id,
            ref: "distributerSchema"
        },
        distributorStoreId: {
            type: object_id,
            ref: "distributerStoreSchema"
        },
        retailerId: {
            type: object_id,
            ref: "retailerSchema"
        },
        salesmanId: {
            type: object_id,
            ref: "salesmanSchema"
        },
        // updatedBy: {
        //     type: object_id,
        //     ref: "salesmanSchema", // Change "salesmanSchema" to the appropriate name of the salesperson schema if needed.
        // },
        customerName: {
            type: String,
            required: true
        },
        items: [
            {
                productId: {
                    type: object_id,
                    ref: "productSchema"
                },
                productName: {
                    type: String,
                    required: true
                },
                cases: {
                    type: Number,
                    required: true
                },
                bottles: {
                    type: Number,
                    required: true
                },
                agreedMRP: {
                    type: Number,
                    required: true
                },
                agreedSP: {
                    type: Number,
                    required: true
                },
            }
        ],
        totalAmount: {
            type: Number,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        pendingAmount: {
            type: Number,
            required: true
        },
        paidAmount: {
            type: Number,
            default: 0
        },
        orderStatus: {
            type: String,
            default: "PENDING",
            enum: ['PENDING', 'REJECTED', 'ACCEPTED', 'DELIVERED'],
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("orderSchema", orderSchema)