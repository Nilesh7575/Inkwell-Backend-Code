const orderModel = require("../../order-services/models/orderModel");
const transactionModel = require("../models/transactionModel");
const retailerModel = require("../../retailer-services/models/retailerModel");
const mongoose = require("mongoose");

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
  try {
    const {
      orderId,
      retailerId,
      transactionStatus,
      amount,
      bankName,
      accountNo,
      chequeNo,
      transactionDate,
      transactionId,
      paymentMode,
    } = req.body;

    // Validate required fields
    if (
      !orderId ||
      !retailerId ||
      !amount ||
      !transactionDate ||
      !paymentMode ||
      !transactionStatus
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await orderModel.findById(orderId);
    // const retailer = await retailerModel.findById(retailerId);

    let originalSurplusAmount = 400
    let pendingAmount = order.pendingAmount;
    let paidAmount = order.paidAmount;
    let surplussAmount;

    // if(surplusAmount > 0){
    if (amount > pendingAmount) {

      surplussAmount = amount - pendingAmount;
      paidAmount = amount - surplussAmount;
      pendingAmount = pendingAmount - paidAmount;
      originalSurplusAmount = originalSurplusAmount + surplussAmount

    } else if (amount < pendingAmount) {

      pendingAmount = pendingAmount - amount;
      paidAmount = amount;

    } else {

      pendingAmount = pendingAmount - amount;
      paidAmount = amount;

    }
    // }

    console.log(order);

    console.log("amount", amount);
    console.log("pendingAmount", pendingAmount);
    console.log("paidAmount", paidAmount);
    console.log("surplussAmount", surplussAmount);
    console.log("originalSurplusAmount", originalSurplusAmount);

    // Create a new transaction
    const transaction = new transactionModel({
      orderId,
      retailerId,
      transactionStatus: transactionStatus || 'PENDING',
      amount,
      bankName,
      accountNo,
      chequeNo,
      transactionDate,
      transactionId,
      paymentMode,
    });

    // // Save the transaction to the database
    // await transaction.save();

    return res.status(201).json(order);
  } catch (err) {
    next(err);
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const adjustSurpluss = async (req, res, next) => {
  try {
    let { orderId,
      surplusAmount, 
      // retailerId 
    } = req.body;

    if (!orderId || !surplusAmount
      // || !retailerId
      ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await orderModel.findById(orderId);
    let pendingAmount = order.pendingAmount;
    let paidAmount = order.paidAmount;

    if(surplusAmount > 0){
      if(surplusAmount == pendingAmount){

        paidAmount = pendingAmount 
        surplusAmount = surplusAmount - pendingAmount
        pendingAmount = surplusAmount

      } else if(surplusAmount > pendingAmount){

        surplusAmount = surplusAmount - pendingAmount
        paidAmount = pendingAmount
        pendingAmount = pendingAmount - paidAmount

      } else{
        
        pendingAmount = pendingAmount - surplusAmount
        paidAmount = surplusAmount
        surplusAmount = surplusAmount - paidAmount
      }
    }

    console.log("surplusAmount", surplusAmount);
    console.log("pendingAmount", pendingAmount);
    console.log("paidAmount", paidAmount);


    return res.status(201).json(order);
  } catch (error) {
    next(error);
    console.log(error);
    return res
      .status(500)
      .json({
        message: `Internal server error, Exception has occure in adjustSurpluss ${error}`,
      });
  }
};

module.exports = {
  getAllPartysOrders,
  getPartyOrderDetails,
  postTransactionDetails,
  adjustSurpluss
};
