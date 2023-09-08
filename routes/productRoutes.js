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


router.post("/create", productValidation, createProduct);
router.get("/getAll", getAllProducts);
router.get("/getById/:id", getProductById);
router.put("/updateById/:id", updateProductById);
router.delete("/deleteById/:id", deleteProductById);

module.exports = router;
