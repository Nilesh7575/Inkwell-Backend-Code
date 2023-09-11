const { body } = require("express-validator");
const brandModel = require("../brand-services/models/brandModel");
const categoryModel = require("../category-services/models/categoryModel");
const productTypeModel = require("../productTypes-services/models/productTypeModel");
const productModel = require("../product-services/models/productModel");

const productValidation = [
    body("productName")
        .isString()
        .withMessage("productName must be a string")
        .trim()
        .notEmpty()
        .withMessage("productName cannot be empty")
        .custom(async (value) => {
            const productName = await productModel.findOne({ productName: value });
            if (productName) {
                throw new Error("Product Name already exists");
            }
            return true;
        }),
    body("manufacturerName")
        .isString()
        .withMessage("manufacturerName must be a string")
        .trim()
        .notEmpty()
        .withMessage("manufacturerName cannot be empty"),
    body("productType")
        .isMongoId()
        .withMessage("Invalid productType")
        .custom(async (value) => {
            const productType = await productTypeModel.findById(value);
            if (!productType) {
                throw new Error("ProductType not found");
            }
            return true;
        }),
    body("category")
        .isMongoId()
        .withMessage("Invalid category")
        .custom(async (value) => {
            const category = await categoryModel.findById(value);
            if (!category) {
                throw new Error("Category not found");
            }
            return true;
        }),
    body("brandId")
        .isMongoId()
        .withMessage("Invalid brandId")
        .custom(async (value) => {
            const brand = await brandModel.findById(value);
            if (!brand) {
                throw new Error("Brand not found");
            }
            return true;
        }),
    body("description")
        .isString()
        .withMessage("Description must be a string")
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty"),
    body("variants.*.quantity")
        .isInt()
        .withMessage("Quantity must be an integer")
        .notEmpty()
        .withMessage("Quantity cannot be empty"),
    body("variants.*.MRP")
        .isNumeric()
        .withMessage("MRP must be a number")
        .notEmpty()
        .withMessage("MRP cannot be empty"),
    body("variants.*.salesPrice")
        .isNumeric()
        .withMessage("Sales price must be a number")
        .notEmpty()
        .withMessage("Sales price cannot be empty"),
];

const isValidImage = function (value) {
    return /\.(jpe?g|png|jpg)$/.test(value);
};

module.exports = { productValidation, isValidImage };
