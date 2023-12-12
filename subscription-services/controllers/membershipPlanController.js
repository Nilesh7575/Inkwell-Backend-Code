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
    res.status(201).json(membershipData);
  } catch (error) {
    next(error);
    // res.status(500).json({ message: error.message });
  }
};

const getAllMembershipPlan = async (req, res, next) => {
  try {
    const membershipData = await membershipPlanSchema.find();
    res.status(200).json(membershipData);
  } catch (error) {
    next(error);
  }
};

const getAllMembershipPlanByDistributorId = async (req, res, next) => {
  try {
    const { distributorId, distributorStoreId } = req.params;
    const membershipData = await membershipPlanSchema.find({
      distributorId,
      distributorStoreId,
    });
    res.status(200).json(membershipData);
  } catch (error) {
    next(error);
  }
};

const updateMembershipPlanById = async (req, res, next) => {
  try {
    const { membershipPlanId } = req.params;
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
    const membershipData = await membershipPlanSchema.findByIdAndUpdate(
      membershipPlanId,
      {
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
    const { membershipPlanId } = req.params;
    const membershipData = await membershipPlanSchema.findByIdAndDelete(
      membershipPlanId
    );
    res.status(200).json(membershipData);
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
