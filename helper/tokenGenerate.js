const jwt = require("jsonwebtoken");


const generateToken = (userId, deviceName, deviceId, isRefreshToken, expiresIn) => {
    const secretKey = process.env.JWT_SECRET_KEY;

    const payload = {
        userId,
        deviceName,
        deviceId,
    };

    const options = {
        expiresIn: isRefreshToken ? expiresIn : '8h',
    };

    // Sign the token using the secret key and options
    const token = jwt.sign(payload, secretKey, options);
    return token;
}

// Function to generate both access token, refresh token, and expiration time
const generateTokens = (userId, deviceName, deviceId) => {
    // Set the expiration time for the access token (e.g., 8 hours)
    const accessTokenExpiresIn = 8 * 60 * 60; // in seconds

    // Set the expiration time for the refresh token (e.g., 7 days)
    const refreshTokenExpiresIn = 24 * 60 * 60; // in seconds

    // Generate an access token with the specified expiration time
    const accessToken = generateToken(userId, deviceName, deviceId, false, accessTokenExpiresIn);

    // Generate a refresh token with the specified expiration time
    const refreshToken = generateToken(userId, deviceName, deviceId, true, refreshTokenExpiresIn);

    return { accessToken, refreshToken, expiresIn: accessTokenExpiresIn };
};

module.exports={generateToken,generateTokens}