const jwt = require("jsonwebtoken");

// Verify the user's JWT token
function authMiddleware(req, res, next) {
    try {
        // Get the token from the request headers
        const authHeader = req.headers.authorization;

        // Check whether the token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        // Extract the token from the header
        const token = authHeader.split(" ")[1];

        // Verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store the user's ID for later use
        req.user = {
            userId: decoded.userId
        };

        // Continue to the next middleware or route
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

// Export the middleware
module.exports = authMiddleware;