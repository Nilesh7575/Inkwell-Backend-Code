const Joi = require('joi');

const productSchemaValidation = Joi.object({
    productName: Joi.string().trim().required(),
    _MFRName: Joi.string().trim().required(),
    productType: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    brandId: Joi.string().trim().required(),
    description: Joi.string().required(),
    // image: Joi.array().items(Joi.string().trim().pattern(/^https?:\/\//)).required(),
    variants: Joi.array().items({
        quantity: Joi.number().positive().required(),
        weight: Joi.number().positive(),
        capacity: Joi.number().positive(),
        packingSize: Joi.number().positive(),
        _MRP: Joi.number().positive().required(),
        salesPrice: Joi.number().positive().required(),
    }).required(),
});
const isValidImage = function (value) {
    return (/\.(jpe?g|png|jpg)$/).test(value);
}

module.exports = { productSchemaValidation, isValidImage }