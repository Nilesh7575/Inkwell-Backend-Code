const express = require("express");
const router = express.Router();
const distributorController = require('../controllers/distributorController');

const { authenticateTokenAndSession } = require("../../middleware/authMiddleware")

router.post("/sendOTP", distributorController.sendOTP);
router.post("/verifyOTP", distributorController.verifyOTP);
router.post("/logout", distributorController.logout);
 
router.get('/getAll', distributorController.getAllDistributor);
router.get('/:id', authenticateTokenAndSession, distributorController.getDistributorById);
router.post('/', distributorController.createDistributor);
router.put('/:id', authenticateTokenAndSession, distributorController.updateDistributor);
router.delete('/:id', authenticateTokenAndSession, distributorController.deleteDistributor);


module.exports = router;
