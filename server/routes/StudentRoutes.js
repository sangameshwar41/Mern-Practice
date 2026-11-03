const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} = require("../controllers/StudentController");

// Require a valid login token for all student routes
router.use(authMiddleware);

// Admin, Staff, and Viewer can view all students
router.get("/",authorizeRoles("admin", "staff", "viewer"),getAllStudents);

// Admin, Staff, and Viewer can view one student
router.get("/:id",authorizeRoles("admin", "staff", "viewer"),getStudentById);

// Only Admin and Staff can create students
router.post("/",authorizeRoles("admin", "staff"), createStudent);

// Only Admin and Staff can edit students
router.patch("/:id",authorizeRoles("admin", "staff"),updateStudent);

// Only Admin can delete students
router.delete("/:id",authorizeRoles("admin"),deleteStudent);

module.exports = router;