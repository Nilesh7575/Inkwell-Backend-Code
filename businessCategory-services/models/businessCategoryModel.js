// models/businessCategory.js
const mongoose = require('mongoose');

const businessCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

const BusinessCategory = mongoose.model('BusinessCategory', businessCategorySchema);

module.exports = BusinessCategory;
