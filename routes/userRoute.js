const express = require('express')
const router = express.Router()
const { createUser, sendOTP, verifyOTP } = require('../controllers/userController')


router.post('/create', createUser)
router.post('/sendOTP', sendOTP)
router.post('/verifyOTP', verifyOTP)





module.exports = router