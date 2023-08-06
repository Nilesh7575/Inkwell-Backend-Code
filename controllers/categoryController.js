const categoryModel = require("../models/categoryModel");
const {
  categoryValidation,
} = require("../validations/brand_category_productType_validation");
const { validationResult } = require("express-validator");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: error.errors[0].msg });
    }

    const categoryNameFind = await categoryModel.findOne({
      categoryName: categoryName,
    });
    if (categoryNameFind) {
      return res
        .status(400)
        .send({ message: "This Category Name Already Exist" });
    }
    const newCategory = new categoryModel(req.body);
    const savedCategory = await newCategory.save();
    return res.status(201).send({ data: savedCategory });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create a new category" });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to get categories" });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to get the category" });
  }
};

// Update a category by ID
exports.updateCategoryById = async (req, res) => {
  try {
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: "Failed to update the category" });
  }
};

// Delete a category by ID
exports.deleteCategoryById = async (req, res) => {
  try {
    const deletedCategory = await categoryModel.findByIdAndRemove(
      req.params.id
    );
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(deletedCategory);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete the category" });
  }
};
