const mongoose = require("mongoose")
const object_id = mongoose.Schema.Types.ObjectId

const subscriptionSchema = mongoose.Schema({
    startDate: {
        type : Date,
        required: true
    },
    endDate: {
        type : Date,
        required: true
    },
    distributerId: {
        type: object_id,
        ref: "distributerSchema",
    },
    distributorStoreId: {
        type: object_id,
        ref: "distributerStoreSchema"
    },
    membershipID: {
        type: object_id,
        ref: "membershipPlanSchema"
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model("Subscription", subscriptionSchema)



//POST,GET