const jwt = require('jsonwebtoken');
const sessionModel = require('../session-services/models/sessionModel');

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
        const session = await sessionModel.findOne({ token }).exec();

        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid token or session expired',
            });
        }

        // Verify the token (you may use your existing token verification logic)
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: Invalid token',
                });
            }

            // Check token expiration
            if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: Token has expired',
                });
            }

            // Attach the decoded user ID to the request for future use
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
