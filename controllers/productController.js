const Product = require('../models/productModel');
const { body, validationResult } = require('express-validator');
const { uploadImageFile } = require('../helper/aws')
const { productSchemaValidation, isValidImage } = require('../validations/productValidation')

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { error, value } = productSchemaValidation.validate(req.body);
        console.log(error)
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({ status: false, message: errorMessage });
        }

        let files = req.files;
        let fileExtension = files[0]

        if (!isValidImage(fileExtension.originalname))
            return res.status(400)
                .send({ status: false, message: "Image format Must be in jpeg,jpg,png" })

        let productImgUrl = await uploadImageFile(files[0]);

        req.body.image = productImgUrl
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save()
        const populatedProduct = await Product.findById(savedProduct._id).populate('productType').populate('category').populate('brandId')

        return res.status(201).send({ data: populatedProduct });
    } catch (err) {
        res.status(500).json({ error: `Failed to create a new product${err}` });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get products' });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get the product' });
    }
};

// Update a product by ID
exports.updateProductById = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update the product' });
    }
};

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndRemove(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(deletedProduct);
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete the product' });
    }
};