const subscriptionSchema = require("../models/subscriptionModel");

const createSubscriptionPlan = async (req, res, next) => {
  try {
    const {
      membershipID,
      distributorStoreId,
      distributerId,
      startDate,
      endDate,
    } = req.body;

    // Validate req.body
    if (
      !membershipID ||
      !distributorStoreId ||
      !distributerId ||
      !startDate ||
      !endDate
    ) {
      return next(new AppError("Please provide all required fields", 400));
    }

    // Creating Subscription Plans
    const subscriptionPlan = await subscriptionSchema.create({
      membershipID,
      distributorStoreId,
      distributerId,
      startDate,
      endDate,
    });

    res.status(201).json({
      status: "success",
      data: {
        subscriptionPlan,
      },
    });
  } catch (err) {
    // Handle specific errors if needed, e.g., duplicate key error
    if (err.code === 11000) {
      return next(new AppError("Duplicate key error", 400));
    }
    next(err);
  }
};

const getSubscriptionPlan = async (req, res, next) => {
  try {
    const subscriptionPlans = await subscriptionSchema.find();

    if (!subscriptionPlans || subscriptionPlans.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No subscription plans found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        subscriptionPlans,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getSubscriptionPlanById = async (req, res, next) => {
  try {
    const { distributorStoreId, distributerId } = req.body;

    // Validate req.body
    if (!distributorStoreId || !distributerId) {
      return next(new AppError("Please provide all required fields", 400));
    }

    // Assuming subscriptionSchema is your Mongoose model
    const subscriptionPlan = await subscriptionSchema.findOne({
      distributorStoreId: distributorStoreId,
      distributerId: distributerId,
    });

    if (!subscriptionPlan) {
      return next(new AppError("Subscription plan not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        subscriptionPlan,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createSubscriptionPlan,
  getSubscriptionPlan,
  getSubscriptionPlanById,
};
