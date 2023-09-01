const express = require("express");
const router = express.Router();
const productTypeController = require("../controllers/productTypeController");
const {
    productTypeValidation,
} = require("../validations/brand_category_productType_validation");

// Create a new product type
router.post(
    "/create",
    productTypeValidation,
    productTypeController.createProductType
);

// Get all product types
router.get("/getAll", productTypeController.getAllProductTypes);

// Get a single product type by ID
router.get("/getById/:id", productTypeController.getProductTypeById);

// Update a product type by ID
router.put("/updateById/:id", productTypeController.updateProductTypeById);

// Delete a product type by ID
router.delete("/deleteById/:id", productTypeController.deleteProductTypeById);

module.exports = router;