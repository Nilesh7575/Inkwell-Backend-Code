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

const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // Verify the refresh token
        jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'Invalid refresh token' });
            }

            const userData = await distributorModel.findById(decoded.userId);

            // Generate a new access token
            const newAccessToken = generateToken(userData._id, decoded.deviceName, decoded.deviceId, false);

            // Send the new access token in the response
            return res.status(200).json({
                success: true,
                accessToken: newAccessToken,
                expiresIn: 8 * 60 * 60, // 8 hours
                message: 'Access token refreshed successfully',
            });
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { authenticateTokenAndSession,refreshAccessToken };
