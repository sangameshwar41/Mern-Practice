const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/CourseController");

// Require login for every course route
router.use(authMiddleware);

// Admin, Staff, and Viewer can view courses
router.get("/", authorizeRoles("admin", "staff", "viewer"), getAllCourses);
router.get("/:id", authorizeRoles("admin", "staff", "viewer"), getCourseById);

// Only Admin can create, edit, or delete courses
router.post("/", authorizeRoles("admin"), createCourse);
router.patch("/:id", authorizeRoles("admin"), updateCourse);
router.delete("/:id", authorizeRoles("admin"), deleteCourse);

module.exports = router;