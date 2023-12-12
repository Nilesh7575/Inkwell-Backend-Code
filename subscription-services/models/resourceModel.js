const mongoose = require("mongoose")
// const object_id = mongoose.Schema.Types.ObjectId

const resourceSchema = mongoose.Schema({
    price : {
        type: Number,
        required: true
    },
    durationType: {
        type : String,
        enum: ['MONTH', 'YEAR'],
        required: true
    },
    durationValue: {
        type : Number,
        required: true
    },
    resourceValue: {
        type : Number,
        required: true
    },
    resourceType :{
        type: String,
        enum: ['DMS', 'SFA'],
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model("Resources", resourceSchema)
// POST,GET,DEL,UPDATE
// ONlY ADMIN

