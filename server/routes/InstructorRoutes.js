const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getAllInstructors,
    getInstructorById,
    createInstructor,
    updateInstructor,
    deleteInstructor
} = require("../controllers/InstructorController");

// Require login for every instructor route
router.use(authMiddleware);

// Admin, Staff, and Viewer can view instructors
router.get("/", authorizeRoles("admin", "staff", "viewer"), getAllInstructors);
router.get("/:id", authorizeRoles("admin", "staff", "viewer"), getInstructorById);

// Only Admin can create, edit, or delete instructors
router.post("/", authorizeRoles("admin"), createInstructor);
router.patch("/:id", authorizeRoles("admin"), updateInstructor);
router.delete("/:id", authorizeRoles("admin"), deleteInstructor);

module.exports = router;