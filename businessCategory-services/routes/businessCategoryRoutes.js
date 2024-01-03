// routes/businessCategoryRoutes.js
const express = require('express');
const router = express.Router();
const businessCategoryController = require('../controllers/businessCategoryController');

// Create a new business category
router.post('/', businessCategoryController.createCategory);

// Get all business categories
router.get('/', businessCategoryController.getAllCategories);

// Get a single business category by ID
router.get('/:categoryId', businessCategoryController.getCategoryById);

// Update a business category by ID
router.put('/:categoryId', businessCategoryController.updateCategory);

// Delete a business category by ID
router.delete('/:categoryId', businessCategoryController.deleteCategory);

module.exports = router;
