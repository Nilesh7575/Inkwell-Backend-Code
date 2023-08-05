const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

// Create a new brand
router.post('/create', brandController.createBrand);

// Get all brands
router.get('/getAll', brandController.getAllBrands);

// Get a single brand by ID
router.get('/getById/:id', brandController.getBrandById);

// Update a brand by ID
router.put('/updateById/:id', brandController.updateBrandById);

// Delete a brand by ID
router.delete('/deleteById/:id', brandController.deleteBrandById);

module.exports = router;
