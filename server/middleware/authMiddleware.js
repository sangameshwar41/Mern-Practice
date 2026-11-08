const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify the user's JWT token and get their role
async function authMiddleware(req, res, next) {
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

        // Find the user in MongoDB using the ID from the token
        const user = await User.findById(decoded.userId).select("_id role");

        // Check whether the user still exists
        if (!user) {
            return res.status(401).json({
                message: "User no longer exists. Please log in again."
            });
        }

        // Store the verified user's ID and role on the request
        req.user = {
            userId: user._id.toString(),
            role: user.role || "viewer"
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