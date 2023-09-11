const express = require("express")
const router = express.Router()
const { getAllOrders, placeOrder, updateOrderStatus, generateBill }  = require('../controllers/orderController')
const { authenticateTokenAndSession } = require("../../middleware/authMiddleware")

router.get('/get-all-orders',authenticateTokenAndSession, getAllOrders)
router.post('/place-order',authenticateTokenAndSession, placeOrder)
router.put('/update-status',authenticateTokenAndSession, updateOrderStatus)
router.get('/generateBill/:orderId',authenticateTokenAndSession, generateBill)

module.exports = router