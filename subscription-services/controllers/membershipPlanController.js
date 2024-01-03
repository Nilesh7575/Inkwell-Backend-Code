const membershipPlanSchema = require("../models/membershipPlanModel");

const createMembershipPlan = async (req, res, next) => {
  try {
    const {
      price,
      durationValue,
      durationType,
      distributorId,
      distributorStoreId,
      planType,
      planDiscription,
      sfaQuantity,
      dmsQuantity,
      discountValue,
    } = req.body;

    //Validate request body
    if (
      !price ||
      !durationValue ||
      !durationType ||
      !distributorId ||
      !distributorStoreId ||
      !planType ||
      !planDiscription ||
      !sfaQuantity ||
      !dmsQuantity ||
      !discountValue
    ) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Create a new membership plan
    const membershipData = await membershipPlanSchema.create({
      price,
      durationValue,
      durationType,
      distributorId,
      distributorStoreId,
      planType,
      planDiscription,
      sfaQuantity,
      dmsQuantity,
      discountValue,
    });
    res.status(201).json({
      message: "Membership Plan created Successfully.",
      data: membershipData,
    });
  } catch (error) {
    next(error);
    // res.status(500).json({ message: error.message });
  }
};

const getAllMembershipPlan = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    const membershipData = await membershipPlanSchema
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ data: membershipData, totalCount: membershipData.length });
  } catch (error) {
    next(error);
  }
};

const getAllMembershipPlanByDistributorId = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { distributorId, distributorStoreId } = req.query;

    // Validate request params
    if (!distributorId || !distributorStoreId) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    const membershipData = await membershipPlanSchema
      .find({
        distributorStoreId: distributorStoreId,
        distributorId: distributorId,
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!membershipData) {
      return res.status(404).json({ error: "Membership Plan not found" });
    }

    res
      .status(200)
      .json({ totalCount: membershipData.length, data: membershipData });
  } catch (error) {
    next(error);
  }
};

const updateMembershipPlanById = async (req, res, next) => {
  try {
    const { membershipPlanId } = req.params;
    console.log(membershipPlanId);

    const {
      price,
      durationValue,
      durationType,
      planType,
      planDiscription,
      sfaQuantity,
      dmsQuantity,
      discountValue,
    } = req.body;

    const membershipData = await membershipPlanSchema.findByIdAndUpdate(
      { _id: membershipPlanId },
      {
        price,
        durationValue,
        durationType,
        planType,
        planDiscription,
        sfaQuantity,
        dmsQuantity,
        discountValue,
      },
      { new: true }
    );
    res.status(200).json(membershipData);
  } catch (error) {
    next(error);
  }
};

const deletemembershipPlanById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const membershipData = await membershipPlanSchema.findByIdAndDelete(id);

    if (!membershipData) {
      return res.status(404).json({ error: "Membership Data not found" });
    }
    res.status(200).json({ message: "Membership Data deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMembershipPlan,
  getAllMembershipPlan,
  getAllMembershipPlanByDistributorId,
  updateMembershipPlanById,
  deletemembershipPlanById,
};
