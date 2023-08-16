const express = require("express")
const router = express.Router()
const { getAllOrders, placeOrder, updateOrderStatus, generateBill }  = require('../controllers/orderController')


router.get('/get-all-orders', getAllOrders)
router.post('/place-order', placeOrder)
router.put('/update-status', updateOrderStatus)
router.get('/generateBill/:orderId', generateBill)


module.exports = router