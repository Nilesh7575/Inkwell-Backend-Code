const express = require('express');
const router = express.Router();
const retailerController = require('../controllers/retailerController');

// Define routes for the Retailer model
router.get('/', retailerController.getAllRetailers);
router.get('/:id', retailerController.getRetailerById);
router.post('/', retailerController.createRetailer);
router.put('/:id', retailerController.updateRetailer);
router.delete('/:id', retailerController.deleteRetailer);

module.exports = router;
