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
            const [
                studentCount,
                activeCourseCount,
                instructorCount,
                userCount,
                recentStudents,
                statusDistribution,
                courseDistribution
            ] = await Promise.all([

                Student.countDocuments(),

                Course.countDocuments({ status: "active" }),

                Instructor.countDocuments(),

                User.countDocuments(),

                Student.find()
                    .select("fullName email enrollmentStatus createdAt course")
                    .populate("course", "courseName courseCode")
                    .sort({ createdAt: -1 })
                    .limit(5),

                Student.aggregate([
                    {
                        $group: {
                            _id: {
                                $ifNull: ["$enrollmentStatus", "enrolled"]
                            },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            status: "$_id",
                            count: 1
                        }
                    }
                ]),

                Course.aggregate([
                    {
                        $lookup: {
                            from: "students",
                            localField: "_id",
                            foreignField: "course",
                            as: "students"
                        }
                    },
                    {
                        $project: {
                           _id: 1,
                           courseName: 1,
                           courseCode: 1,
                           studentCount: { $size: "$students" }
}
                    }
                ])

            ]);

            return res.status(200).json({
                message: "Dashboard reports retrieved successfully",

                reports: {
                    students: studentCount,
                    activeCourses: activeCourseCount,
                    instructors: instructorCount,
                    users: userCount,
                    recentStudents: recentStudents,
                    statusDistribution: statusDistribution,
                    courseDistribution: courseDistribution
                }
            });

        } catch (error) {
            console.error("Dashboard reports error:", error);

            return res.status(500).json({
                message: "Unable to retrieve dashboard reports"
            });
        }
    }
);

module.exports = router;