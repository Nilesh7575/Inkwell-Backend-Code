const brandModel = require("../models/brandModel");
const { isValidImage } = require("../validations/productValidation");
const { uploadImageFile } = require("../helper/aws");

// Create a new brand
exports.createBrand = async (req, res) => {
  try {
    const { brandName, description } = req.body;
    const files = req.files;

    if (files || files[0]) {
      let fileExtension = files[0];
      if (!isValidImage(fileExtension.originalname))
        return res.status(400).send({
          status: false,
          message: "Image format Must be in jpeg,jpg,png",
        });

      let logoUrl = await uploadImageFile(files[0]);
      req.body.logo = logoUrl;
    }
    const brandNameFind = await brandModel.findOne({ brandName: brandName });
    if (brandNameFind) {
      return res
        .status(400)
        .send({ message: "This Brand Name Already Exist!" });
    }
    const newBrand = new brandModel(req.body);
    const savedBrand = await newBrand.save();

    return res.status(201).send({ data: savedBrand });
  } catch (err) {
    console.error("Error creating brand:", err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to create a new brand" });
  }
};

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await brandModel.find();
    return res.json(brands);
  } catch (err) {
    return res.status(500).json({ error: "Failed to get brands" });
  }
};

// Get a single brand by ID
exports.getBrandById = async (req, res) => {
  try {
    const brand = await brandModel.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    return res.json(brand);
  } catch (err) {
    return res.status(500).json({ error: "Failed to get the brand" });
  }
};

// Update a brand by ID
exports.updateBrandById = async (req, res) => {
  try {
    const updatedBrand = await brandModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    return res.json(updatedBrand);
  } catch (err) {
    return res.status(500).json({ error: "Failed to update the brand" });
  }
};

// Delete a brand by ID
exports.deleteBrandById = async (req, res) => {
  try {
    const deletedBrand = await brandModel.findByIdAndRemove(req.params.id);
    if (!deletedBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    return res.json(deletedBrand);
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete the brand" });
  }
};
