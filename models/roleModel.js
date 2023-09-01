const mongoose = require('mongoose');


const roleSchema = new mongoose.Schema({

    role: {
        type: String,
        enum: ['DISTRIBUTOR', 'SALESMAN', 'RETAILER'],
    }
})

module.exports = mongoose.model("role", roleSchema)