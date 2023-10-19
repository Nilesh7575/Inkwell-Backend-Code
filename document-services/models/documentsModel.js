const mongoose = require("mongoose")
const object_id = mongoose.Schema.Types.ObjectId

const documentsSchema = mongoose.Schema({
    documentURL : {
        type: String,
        required: true
    },
    belongs_to : {
        type: object_id,
        required: true
    },
    documentType: {
        type: String,
            enum: ['KYC', 'ORDERBILL'],
    }
},
{
    timestamps: true,
}
)

module.exports = mongoose.model("documentDB", documentsSchema)