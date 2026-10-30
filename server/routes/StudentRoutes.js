const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");


const {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} = require("../controllers/StudentController");

// Activate authentication for all student routes
router.use(authMiddleware);

// Get all students
router.get("/", getAllStudents);

// Get one student by ID
router.get("/:id", getStudentById);

// Create a student
router.post("/", createStudent);

// Update selected student fields
router.patch("/:id", updateStudent);

// Delete a student
router.delete("/:id", deleteStudent);

module.exports = router;