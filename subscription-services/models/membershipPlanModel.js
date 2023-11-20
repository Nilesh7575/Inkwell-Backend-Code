const mongoose = require("mongoose")
const object_id = mongoose.Schema.Types.ObjectId

const packageSchema = mongoose.Schema({
    price : {
        type: Number,
        required: true
    },
    // Uesr REf Id
    // User Role

    // startDate: {
    //     type : Date,
    //     required: true
    // },
    // endDate: {
    //     type : Date,
    //     required: true
    // },
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
        enum: ['DMS', 'SFA', 'MIXED'],
    },
    planDiscription :{
        type: String,
        required: true
    },
    sfaQuantity : {
        type: Number,
        required: true
    },
    dmsQuantity : {
        type: Number,
        required: true
    },
    discountValue :{
        type: Number,
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model("membershipPlanDB", packageSchema)


// POST,GET,DEL,UODATE