const express = require("express");
const router = express.Router();
const {
    createUser,
    sendOTP,
    verifyOTP,
    logout,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
} = require("../controllers/userController");

const { authenticateTokenAndSession } = require("../middleware/authMiddleware")

router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/logout",  logout);
router.post("/create", authenticateTokenAndSession, createUser);
router.get("/getAll", getAllUsers);
router.get("/getById/:id", authenticateTokenAndSession, getUserById);
router.put("/updateById/:userId", authenticateTokenAndSession, updateUserById);
router.delete("/deleteById/:userId", authenticateTokenAndSession, deleteUserById);

module.exports = router;
