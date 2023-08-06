const express = require("express");
const router = express.Router();
const {
    createUser,
    sendOTP,
    verifyOTP,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
} = require("../controllers/userController");

router.post("/create", createUser);
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.get("/getAll", getAllUsers);
router.get("/getById/:id", getUserById);
router.put("/updateById/:id", updateUserById);
router.delete("/deleteById/:id", deleteUserById);

module.exports = router;
