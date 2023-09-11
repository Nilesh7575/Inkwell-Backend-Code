const Joi = require('joi');
const { body } = require('express-validator');
const brandModel = require("../brand-services/models/brandModel");
const categoryModel = require("../category-services/models/categoryModel");
const productTypeModel = require("../productTypes-services/models/productTypeModel");


const brandValidation = [
    body('brandName').isString().withMessage('brand Name must be a string')
        .trim()
        .notEmpty().withMessage('brand Name cannot be empty')
        .matches(/^[A-Za-z\s]+$/).withMessage('Brand Name can only contain alphabets')
        .custom(async (value) => {
            const brand = await brandModel.findOne({ brandName: value });
            if (brand) {
                throw new Error('Brand name already exists');
            }
            return true;
        }),
    body('description')
        .isString().withMessage('Description must be a string')
        .notEmpty().withMessage('Description cannot be empty')
        .matches(/^[A-Za-z]+$/).withMessage('Description can only contain alphabets'),
];

const categoryValidation = [
    body('categoryName').isString().withMessage('category Name must be a string')
        .trim()
        .notEmpty().withMessage('category Name cannot be empty')
        .matches(/^[A-Za-z\s]+$/).withMessage('Category Name can only contain alphabets')
        .custom(async (value) => {
            const brand = await categoryModel.findOne({ categoryName: value });
            if (brand) {
                throw new Error('Category name already exists');
            }
            return true;
        }),
    body('description')
        .isString().withMessage('Description must be a string')
        .notEmpty().withMessage('Description cannot be empty')
        .matches(/^[A-Za-z\s]+$/).withMessage('Description can only contain alphabets'),
];

const productTypeValidation = [
    body('typeName').isString().withMessage('typeName must be a string')
        .trim()
        .notEmpty().withMessage('typeName cannot be empty')
        .matches(/^[A-Za-z\s]+$/).withMessage('typeName can only contain alphabets')
        .custom(async (value) => {
            const brand = await productTypeModel.findOne({ typeName: value });
            if (brand) {
                throw new Error('typeName name already exists');
            }
            return true;
        }),
    body('description')
        .isString().withMessage('Description must be a string')
        .notEmpty().withMessage('Description cannot be empty')
        .matches(/^[A-Za-z\s]+$/).withMessage('Description can only contain alphabets'),
];

module.exports = { brandValidation, categoryValidation, productTypeValidation }