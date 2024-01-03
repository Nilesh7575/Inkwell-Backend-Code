const jwt = require('jsonwebtoken');
const sessionModel = require('../session-services/models/sessionModel');
const deviceModel = require('../session-services/models/deviceModel');
const { generateTokens } = require('../helper/tokenGenerate');

const secretKey = process.env.JWT_SECRET_KEY

const authenticateTokenAndSession = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const refreshToken = req.header('RefreshToken');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Token not provided',
        });
    }

    const token = authHeader.substring('Bearer '.length);

    try {
        // Verify the access token
        const decoded = jwt.verify(token, secretKey);

        const session = await sessionModel.findOne({
            userId: decoded.userId,
            deviceId: decoded.deviceId,
            deviceName: decoded.deviceName
        }).exec();

        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid Access token, token cred mismatch or already login with another device',
            });
        }

        // Check expiration of the access token
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            // Verify the refresh token
            const refTokenDecoded = jwt.verify(refreshToken, secretKey);

            // Check expiration of the refresh token
            if (refTokenDecoded.exp && Date.now() >= refTokenDecoded.exp * 1000) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: Refresh Token has expired',
                });
            }

            // Verify the refresh token's session
            const refreshSession = await sessionModel.findOne({
                userId: refTokenDecoded.userId,
                deviceId: refTokenDecoded.deviceId,
                deviceName: refTokenDecoded.deviceName
            }).exec();

            if (!refreshSession) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: Invalid Refresh token, token cred mismatch',
                });
            }

            // Generate new tokens and set headers
            const { accessToken, refreshToken, expiresIn } = generateTokens(decoded.userId, decoded.deviceName, decoded.deviceId);
            res.header('Authorization', accessToken);
            res.header('RefreshToken', refreshToken);

            req.userId = decoded.userId;
            next();
        } else {
            req.userId = decoded.userId;
            next();
        }
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Invalid token',
        });
    }
};

module.exports = { authenticateTokenAndSession };
