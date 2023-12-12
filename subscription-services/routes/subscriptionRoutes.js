const express = require("express");
const router = express.Router();

const {
  authenticateTokenAndSession,
} = require("../../middleware/authMiddleware");

const {
  createSubscriptionPlan,
  getSubscriptionPlan,
  getSubscriptionPlanById,
} = require("../controllers/subscriptionController");

router.post("/create", authenticateTokenAndSession, createSubscriptionPlan);

router.get(
  "/getAllSubscriptionPlan",
  authenticateTokenAndSession,
  getSubscriptionPlan
);

router.get(
  "/getSubscriptionPlanById",
  authenticateTokenAndSession,
  getSubscriptionPlanById
);

module.exports = router;
