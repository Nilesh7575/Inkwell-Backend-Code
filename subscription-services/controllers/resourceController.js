const resourceModel = require("../models/resourceModel");

const createResource = async (req, res, next) => {
  try {
    const { durationType, durationValue, resourceValue, resourceType, price } =
      req.body;

    //Validate request body
    if (
      !durationType ||
      !durationValue ||
      !resourceValue ||
      !resourceType ||
      !price
    ) {
      return res
        .status(400)
        .json({ error: "Requested Data should not be empty" });
    }

    const resourceData = await resourceModel.create({
      durationType: durationType,
      durationValue: durationValue,
      resourceValue: resourceValue,
      resourceType: resourceType,
      price: price
    });

    return res
      .status(201)
      .json({ message: "Resouce Data added successfully", resourceData });
  } catch (error) {
    next(error);
  }
};

const getAllResource = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch all resources from the database
    const resourceData = await resourceModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ data: resourceData, totalCount: resourceData.length });
  } catch (error) {
    next(error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    const { resourceId, price } = req.body;

    // Validate request body
    if (!resourceId || !price) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // Check if the resource exists
    const resource = await resourceModel.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // Update the resource price
    resource.price = price;
    await resource.save();

    return res
      .status(200)
      .json({ data: resource, message: "Resource price updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const id = req.params.id;

    const resource = await resourceModel.findByIdAndDelete(id);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }
    return res.status(200).json({ message: "Resource deleted successfully" });
  }
  catch (error) {
    next(error);
  }
}

module.exports = { createResource, getAllResource, updateResource, deleteResource };
