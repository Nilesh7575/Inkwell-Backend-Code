const express = require('express');
const router = express.Router();
const retailerstoreController = require('../controllers/retailerStoreController');

// Define routes for the Retailerstore model
router.get('/', retailerstoreController.getAllRetailerstores);
router.get('/:id', retailerstoreController.getRetailerstoreById);
router.post('/', retailerstoreController.createRetailerstore);
router.put('/:id', retailerstoreController.updateRetailerstore);
router.delete('/:id', retailerstoreController.deleteRetailerstore);

module.exports = router;
