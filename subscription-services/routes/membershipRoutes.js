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

router.post("/create", authenticateTokenAndSession, createMembershipPlan);

router.get("/getAll", authenticateTokenAndSession, getAllMembershipPlan);

router.get(
  "/getAllByDistributorId/:id",
  authenticateTokenAndSession,
  getAllMembershipPlanByDistributorId
);

router.put(
  "/update/:id",
  authenticateTokenAndSession,
  updateMembershipPlanById
);

router.delete(
  "/delete/:id",
  authenticateTokenAndSession,
  deletemembershipPlanById
);

module.exports = router;
