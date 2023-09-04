const express = require("express");
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById,
} = require("../controllers/productController");
const { productValidation } = require("../validations/productValidation");

// Create a new product
router.post("/create", productValidation, createProduct);

// Get all
router.get("/getAll", getAllProducts);

// Get a single product by ID
router.get("/getById/:id", getProductById);

// Update a product by ID
router.put("/updateById/:id", updateProductById);

// Delete a product by ID
router.delete("/deleteById/:id", deleteProductById);

module.exports = router;
