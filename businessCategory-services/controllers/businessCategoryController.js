// controllers/businessCategoryController.js
const BusinessCategory = require('../models/businessCategoryModel');

// Create a new business category
const createCategory = async (req, res) => {
    try {
        const { name} = req.body;
        const category = await BusinessCategory.create({ name});
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all business categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await BusinessCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a single business category by ID
const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await BusinessCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a business category by ID
const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name} = req.body;
        const category = await BusinessCategory.findByIdAndUpdate(
            categoryId,
            { name},
            { new: true }
        );
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a business category by ID
const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await BusinessCategory.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
