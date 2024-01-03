const express = require("express");
const router = express.Router();

const {
  authenticateTokenAndSession,
} = require("../../middleware/authMiddleware");

const {
  createMembershipPlan,
  getAllMembershipPlan,
  getAllMembershipPlanByDistributorId,
  updateMembershipPlanById,
  deletemembershipPlanById,
} = require("../controllers/membershipPlanController");

router.post("/createMembershipPlan", createMembershipPlan);

router.get("/getAllMembershipPlan", getAllMembershipPlan);

router.get(
  "/getAllMembershipPlanByDistributorId",
  getAllMembershipPlanByDistributorId
);

router.put(
  "/updateMembershipPlan",
  authenticateTokenAndSession,
  updateMembershipPlanById
);

router.delete(
  "/deleteMembershipPlan/:id",
  authenticateTokenAndSession,
  deletemembershipPlanById
);

module.exports = router;
