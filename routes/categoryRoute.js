const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Create a new category
router.post('/create', categoryController.createCategory);

// Get all 
router.get('/getAll', categoryController.getAllCategories);

// Get a single category by ID
router.get('/getById/:id', categoryController.getCategoryById);

// Update a category by ID
router.put('/updateById/:id', categoryController.updateCategoryById);

// Delete a category by ID
router.delete('/deleteById/:id', categoryController.deleteCategoryById);

module.exports = router;
