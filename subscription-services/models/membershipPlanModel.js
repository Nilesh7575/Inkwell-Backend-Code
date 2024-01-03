const mongoose = require("mongoose")
const object_id = mongoose.Schema.Types.ObjectId

const membershipPlanSchema = mongoose.Schema({
    price : {
        type: Number,
        required: true
    },
    distributorId: {
        type: object_id,
        ref: "distributerSchema",
    },
    distributorStoreId: {
        type: object_id,
        ref: "distributerStoreSchema"
    },
    // User Role
    durationType: {
        type : String,
        enum: ['MONTH', 'YEAR'],
        required: true
    },
    durationValue: {
        type : Number,
        required: true
    },
    planType :{
        type: String,
        enum: ['DMS', 'SFA', "DMS+SFA"],
    },
    planDiscription :{
        type: String,
        required: true
    },
    sfaQuantity : {
        type: Number,
    },
    dmsQuantity : {
        type: Number,
    },
    discountValue :{
        type: Number,
    },
    isActivePlan :{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model("MembershipPlan", membershipPlanSchema)


// POST,GET,DEL,UPDATE