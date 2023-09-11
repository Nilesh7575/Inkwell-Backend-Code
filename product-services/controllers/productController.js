const { validationResult } = require("express-validator");
const productModel = require("../models/productModel");
const { uploadImageFile } = require("../../helper/aws");
const { isValidImage } = require("../../validations/productValidation");

exports.createProduct = async (req, res) => {
    try {
        const { productName } = req.body;
        let files = req.files;

        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res
                .status(400)
                .json({ success: false, message: error.errors[0].msg });
        }

        if (files.length > 0) {
            let fileExtension = files[0];
            if (!isValidImage(fileExtension.originalname))
                return res.status(400).send({
                    status: false,
                    message: "Image format Must be in jpeg,jpg,png",
                });

            let ImageUrl = await uploadImageFile(files[0]);
            req.body.image = ImageUrl;
        }
        const newProduct = new productModel(req.body);
        const savedProduct = await newProduct.save();
        const populatedProduct = await productModel
            .findById(savedProduct._id)
            .populate("productType")
            .populate("category")
            .populate("brandId");

        return res.status(201).send({ data: populatedProduct });
    } catch (err) {
        res.status(500).json({ error: `Failed to create a new product${err}` });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1;
        const perPage = parseInt(req.body.perPage) || 10;

        const totalProducts = await productModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / perPage);

        const products = await productModel
            .find()
            .populate({path:'productType',select:"_id typeName"})
            .populate({path:'category',select:"_id categoryName"})
            .populate({path:'brandId',select:"_id brandName"})
            .skip((page - 1) * perPage)
            .limit(perPage);

        const response = {
            page,
            perPage,
            totalPages,
            totalProducts,
            products,
        };
        return res.status(200).send({ success: true, response });
    } catch (err) {
        res.status(500).json({ error: "Failed to get products" });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await productModel
            .findById(req.params.id)
            .populate("productType")
            .populate("category")
            .populate("brandId");

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: "Failed to get the product" });
    }
};

// Update a product by ID
exports.updateProductById = async (req, res) => {
    try {
        const updatedProduct = await productModel
            .findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate("productType")
            .populate("category")
            .populate("brandId");
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: "Failed to update the product" });
    }
};

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
    try {
        const deletedProduct = await productModel.findByIdAndRemove(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(deletedProduct);
    } catch (err) {
        res.status(500).json({ error: "Failed to delete the product" });
    }
};
