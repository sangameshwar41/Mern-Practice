const express = require("express");

const {
    registerUser,
    loginUser,
    getUserProfile,
    changePassword,
    forgotPassword,
    resetPassword
} = require("../controllers/AuthController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login an existing user
router.post("/login", loginUser);

// Get the logged-in user's profile
router.get("/profile", authMiddleware, getUserProfile);

// Change password (protected route)
router.patch("/change-password", authMiddleware, changePassword);

// Request password reset
router.post("/forgot-password", forgotPassword);

// Reset password using the reset token
router.post("/reset-password", resetPassword);

module.exports = router;