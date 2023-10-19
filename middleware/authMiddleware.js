const jwt = require('jsonwebtoken');
const sessionModel = require('../session-services/models/sessionModel');
const deviceModel = require('../session-services/models/deviceModel');

const secretKey = process.env.JWT_SECRET_KEY


const authenticateTokenAndSession = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Token not provided',
        });
    }

    const token = authHeader.substring('Bearer '.length);

    try {
        // Verify the token (you may use your existing token verification logic)
        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: Invalid token',
                });
            }
            const session = await deviceModel.findOne({ deviceId: decoded.deviceId, isDeleted: false }).exec();

            if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: Token has expired',
                });
            }
            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: Invalid token or session expired, you already login in the another Device',
                });
            }
            req.userId = decoded.userId;
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }

};

module.exports = { authenticateTokenAndSession };
