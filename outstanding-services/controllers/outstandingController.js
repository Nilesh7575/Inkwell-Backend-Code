const orderModel = require("../../order-services/models/orderModel");
const transactionModel = require("../models/transactionModel");
const mongoose = require('mongoose');

const getAllPartysOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const orderStatus = "DELIVERED";
    const customerName = req.query.customerName || null;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build the query object for filtering
    const query = {};
    if (orderStatus) {
      query.orderStatus = orderStatus;
    }
    if (customerName) {
      // query.customerName = { $regex: customerName, $options: 'i' };
      query.customerName = { $regex: new RegExp(customerName, "i") };
    }

    // Fetch orders from the database with pagination
    const orders = await orderModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({ data: orders, totalCount: orders.length });
  } catch (err) {
    next(err);
  }
};

const getPartyOrderDetails = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the order by ID in the MongoDB collection
    const order = await orderModel.findById(id);

    // Check if the order was found
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);

  } catch (err) {
    next(err);
    console.log(err);
  }
};

const postTransactionDetails = async (req, res, next) => {
    
}

module.exports = { getAllPartysOrders, getPartyOrderDetails };
