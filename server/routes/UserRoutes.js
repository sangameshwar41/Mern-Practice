
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

const User = require("../models/User");

// Get all users - Admin only
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    async function (req, res) {
        try {
            const users = await User.find()
                .select("_id username email role createdAt");

            return res.status(200).json({
                message: "Users retrieved successfully",
                users: users
            });
        } catch (error) {
            console.error("Get users error:", error.name);

            return res.status(500).json({
                message: "Unable to retrieve users"
            });
        }
    }
);

// Change a user's role - Admin only
router.patch(
    "/:id/role",
    authMiddleware,
    authorizeRoles("admin"),
    validateObjectId(),
    async function (req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            // Prevent an admin from changing their own role
            if (id === req.user.userId) {
                return res.status(403).json({
                    message: "You cannot change your own role."
                });
            }

            // Check that role is a valid string
            const allowedRoles = ["admin", "staff", "viewer"];

            if (
                typeof role !== "string" ||
                !allowedRoles.includes(role)
            ) {
                return res.status(400).json({
                    message: "Role must be admin, staff, or viewer"
                });
            }

            // Find the user
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            // Update the user's role
            user.role = role;

            await user.save();

            return res.status(200).json({
                message: "User role updated successfully",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error("Update user role error:", error.name);

            return res.status(500).json({
                message: "Unable to update user role"
            });
        }
    }
);

module.exports = router;
