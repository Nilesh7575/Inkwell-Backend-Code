const express = require('express');
const controller = require('./Product.controller');
const router = express.Router();

router.post('/createProduct',controller.createProduct);

router.get('/getProducts',controller.getAllProducts);

router.get('/getProduct/:productId',controller.getOneProduct);

router.put('/updateProduct/:productId',controller.updateProduct);

router.delete('/delProduct/:productId',controller.deleteProduct);

module.exports = router;