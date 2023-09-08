const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");
const {
    brandValidation,
} = require("../validations/brand_category_productType_validation");
 

router.post("/create", brandValidation, brandController.createBrand);
router.get("/getAll", brandController.getAllBrands);
router.get("/getById/:id", brandController.getBrandById);
router.put("/updateById/:id", brandController.updateBrandById);
router.delete("/deleteById/:id", brandController.deleteBrandById);

module.exports = router;
