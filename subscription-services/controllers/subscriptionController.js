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
      return res
        .status(400)
        .json({ error: "Requested Data should not be empty" });
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
      status: "Subscription done successfully",
      data: subscriptionPlan,
    });
  } catch (err) {
    next(err);
  }
};

const getSubscriptionPlan = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    const subscriptionPlans = await subscriptionSchema
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { distributorStoreId, distributerId } = req.body;

    // Validate req.body
    if (!distributorStoreId || !distributerId) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Assuming subscriptionSchema is your Mongoose model
    const subscriptionPlan = await subscriptionSchema
      .find({
        distributorStoreId: distributorStoreId,
        distributerId: distributerId,
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!subscriptionPlan) {
      res.status(404).json({ error: "Subscription plan not found" });
    }

    res.status(200).json({
      status: "success",
      totalCount: subscriptionPlan.length,
      data: subscriptionPlan,
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
