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
const validate = require("../middleware/validate");

const {
    registerSchema,
    loginSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} = require("../validators/authValidator");

const router = express.Router();

// Register
router.post(
    "/register",
    validate(registerSchema),
    registerUser
);

// Login
router.post(
    "/login",
    validate(loginSchema),
    loginUser
);

// Get profile
router.get(
    "/profile",
    authMiddleware,
    getUserProfile
);

// Change password
router.patch(
    "/change-password",
    authMiddleware,
    validate(changePasswordSchema),
    changePassword
);

// Forgot password
router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    forgotPassword
);

// Reset password
router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPassword
);

module.exports = router;