const express = require('express')
const router = express.Router()
const {createProduct}=require('../../src/controllers/productController')

router.post('/createProduct',createProduct);




module.exports = router;