const ProductType = require("../models/productTypeModel");
const {
    typeSchema,
} = require("../validations/brand_category_productType_validation");
const { validationResult } = require("express-validator");

// Create a new product type
exports.createProductType = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res
                .status(400)
                .json({ success: false, message: error.errors[0].msg });
        }
        const newProductType = new ProductType(req.body);
        const savedProductType = await newProductType.save();
        res.status(201).send({ data: savedProductType });
    } catch (err) {
        res.status(500).json({ error: "Failed to create a new product type" });
    }
};

// Get all product types
exports.getAllProductTypes = async (req, res) => {
    try {
        const productTypes = await ProductType.find();
        res.json(productTypes);
    } catch (err) {
        res.status(500).json({ error: "Failed to get product types" });
    }
};

// Get a single product type by ID
exports.getProductTypeById = async (req, res) => {
    try {
        const productType = await ProductType.findById(req.params.id);
        if (!productType) {
            return res.status(404).json({ error: "Product type not found" });
        }
        res.json(productType);
    } catch (err) {
        res.status(500).json({ error: "Failed to get the product type" });
    }
};

// Update a product type by ID
exports.updateProductTypeById = async (req, res) => {
    try {
        const updatedProductType = await ProductType.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedProductType) {
            return res.status(404).json({ error: "Product type not found" });
        }
        res.json(updatedProductType);
    } catch (err) {
        res.status(500).json({ error: "Failed to update the product type" });
    }
};

// Delete a product type by ID
exports.deleteProductTypeById = async (req, res) => {
    try {
        const deletedProductType = await ProductType.findByIdAndRemove(
            req.params.id
        );
        if (!deletedProductType) {
            return res.status(404).json({ error: "Product type not found" });
        }
        res.json(deletedProductType);
    } catch (err) {
        res.status(500).json({ error: "Failed to delete the product type" });
    }
};
