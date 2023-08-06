const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");
const {
    brandValidation,
} = require("../validations/brand_category_productType_validation");

// Create a new brand
router.post("/create", brandValidation, brandController.createBrand);

// Get all brands
router.get("/getAll", brandController.getAllBrands);

// Get a single brand by ID
router.get("/getById/:id", brandController.getBrandById);

// Update a brand by ID
router.put("/updateById/:id", brandController.updateBrandById);

// Delete a brand by ID
router.delete("/deleteById/:id", brandController.deleteBrandById);

module.exports = router;
