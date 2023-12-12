const express = require("express");
const router = express.Router();
const distributorController = require('../controllers/distributorController');

const { authenticateTokenAndSession } = require("../../middleware/authMiddleware")

router.post("/sendOTP", distributorController.sendOTP);
router.post("/verifyOTP", distributorController.verifyOTP);
router.post("/logout", distributorController.logout);

router.get('/:id', authenticateTokenAndSession, distributorController.getDistributorById);
router.post('/', authenticateTokenAndSession, distributorController.createDistributor);
router.put('/:userId', authenticateTokenAndSession, distributorController.updateDistributor);
router.delete('/:id', authenticateTokenAndSession, distributorController.deleteDistributor);

router.get('/getAll', distributorController.getAllDistributor);

module.exports = router;
