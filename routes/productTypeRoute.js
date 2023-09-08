const express = require("express");
const router = express.Router();
const productTypeController = require("../controllers/productTypeController");
const {
    productTypeValidation,
} = require("../validations/brand_category_productType_validation");

// Create a new product type
router.post("/create", productTypeValidation, productTypeController.createProductType);
router.get("/getAll", productTypeController.getAllProductTypes);
router.get("/getById/:id", productTypeController.getProductTypeById);
router.put("/updateById/:id", productTypeController.updateProductTypeById);
router.delete("/deleteById/:id", productTypeController.deleteProductTypeById);

module.exports = router;
