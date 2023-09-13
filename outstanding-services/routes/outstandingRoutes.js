const express = require('express')
const router = express.Router()
const { getAllPartysOrders, getPartyOrderDetails } = require('../controllers/outstandingController')
const { authenticateTokenAndSession } = require('../../middleware/authMiddleware')

router.get('/getAllPartysOrders', authenticateTokenAndSession, getAllPartysOrders)
router.get('/getPartyOrderDetails/:id', authenticateTokenAndSession, getPartyOrderDetails)

module.exports = router