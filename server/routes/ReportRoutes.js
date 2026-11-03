const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const Student = require("../models/Student");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const User = require("../models/User");

router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    async function (req, res) {
        try {
            const studentCount = await Student.countDocuments();
            const courseCount = await Course.countDocuments();
            const instructorCount = await Instructor.countDocuments();
            const userCount = await User.countDocuments();

            return res.status(200).json({
                message: "Reports retrieved successfully",
                reports: {
                    students: studentCount,
                    courses: courseCount,
                    instructors: instructorCount,
                    users: userCount
                }
            });
        } catch (error) {
            console.error("Reports error:", error);

            return res.status(500).json({
                message: "Unable to retrieve reports"
            });
        }
    }
);

module.exports = router;