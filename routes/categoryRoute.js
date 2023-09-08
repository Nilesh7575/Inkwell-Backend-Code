const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { categoryValidation, } = require("../validations/brand_category_productType_validation");

// Create a new category
router.post("/create", categoryValidation, categoryController.createCategory);
router.get("/getAll", categoryController.getAllCategories);
router.get("/getById/:id", categoryController.getCategoryById);
router.put("/updateById/:id", categoryController.updateCategoryById);
router.delete("/deleteById/:id", categoryController.deleteCategoryById);

module.exports = router;
