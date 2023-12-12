const express = require("express");
const router = express.Router();

const {
  authenticateTokenAndSession,
} = require("../../middleware/authMiddleware");
const {
  createResource,
  getAllResource,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController");

router.post("/createResource", createResource);

router.get("/getAllResource", getAllResource);

router.put("/updateResource", updateResource);

router.delete(
  "/deleteResource/:id",
  deleteResource
);

module.exports = router;
