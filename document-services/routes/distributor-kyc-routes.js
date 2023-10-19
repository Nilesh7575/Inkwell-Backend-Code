const express = require("express")
const router = express.Router()
const { authenticateTokenAndSession } = require('../../middleware/authMiddleware')
const { uploadKYCDocuments } = require('../controllers/distributor-kyc')

router.post('/distributor-kyc-uploads', uploadKYCDocuments)

module.exports = router