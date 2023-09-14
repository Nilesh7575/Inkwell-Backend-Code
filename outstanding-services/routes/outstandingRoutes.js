const express = require("express");
const router = express.Router();
const {
  getAllPartysOrders,
  getPartyOrderDetails,
  postTransactionDetails,
  adjustSurpluss,
} = require("../controllers/outstandingController");
const {
  authenticateTokenAndSession,
} = require("../../middleware/authMiddleware");

router.get(
  "/getAllPartysOrders",
  authenticateTokenAndSession,
  getAllPartysOrders
);
router.get(
  "/getPartyOrderDetails/:id",
  authenticateTokenAndSession,
  getPartyOrderDetails
);
router.post(
  "/postTransactionDetails",
  authenticateTokenAndSession,
  postTransactionDetails
);
router.post('/adjustSurpluss',
// authenticateTokenAndSession,
adjustSurpluss
);

module.exports = router;
