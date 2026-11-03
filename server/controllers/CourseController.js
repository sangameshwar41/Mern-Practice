const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const Student = require("../models/Student");
const mongoose = require("mongoose");

// Get all courses and their enrolled-student counts
async function getAllCourses(req, res, next) {
    try {
        const courses = await Course.find()
            .populate("instructor", "instructorName email specialization");

        const coursesWithCounts = await Promise.all(
            courses.map(async function (course) {
                const studentCount = await Student.countDocuments({
                    course: course._id
                });

                return {
                    ...course.toObject(),
                    studentCount: studentCount
                };
            })
        );

        return res.status(200).json({
            message: "Courses retrieved successfully",
            courses: coursesWithCounts
        });
    } catch (error) {
        next(error);
    }
}

// Get one course and its enrolled students
async function getCourseById(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        const course = await Course.findById(id)
            .populate("instructor", "instructorName email specialization");

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        const students = await Student.find({ course: course._id })
            .select("fullName email mobileNumber gender address createdAt");

        return res.status(200).json({
            message: "Course retrieved successfully",
            course: course,
            studentCount: students.length,
            students: students
        });
    } catch (error) {
        next(error);
    }
}

// Validate an instructor reference
async function validateInstructor(instructorId) {
    if (instructorId === null || instructorId === "") {
        return null;
    }

    if (!mongoose.isObjectIdOrHexString(instructorId)) {
        const error = new Error("Invalid instructor ID");
        error.statusCode = 400;
        throw error;
    }

    const instructor = await Instructor.findById(instructorId);

    if (!instructor) {
        const error = new Error("Instructor not found");
        error.statusCode = 404;
        throw error;
    }

    return instructor._id;
}

// Create a course
async function createCourse(req, res, next) {
    try {
        const {
            courseName,
            courseCode,
            description,
            duration,
            fee,
            status,
            instructor
        } = req.body;

        if (
            !courseName ||
            !courseCode ||
            !duration ||
            fee === undefined ||
            fee === null ||
            fee === ""
        ) {
            return res.status(400).json({
                message: "Course name, course code, duration, and fee are required"
            });
        }

        const instructorId = await validateInstructor(instructor);

        const course = await Course.create({
            courseName,
            courseCode,
            description,
            duration,
            fee,
            status,
            instructor: instructorId
        });

        return res.status(201).json({
            message: "Course created successfully",
            course: course
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Course code already exists"
            });
        }

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                message: error.message
            });
        }

        next(error);
    }
}

// Update a course
async function updateCourse(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        const allowedFields = [
            "courseName",
            "courseCode",
            "description",
            "duration",
            "fee",
            "status",
            "instructor"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update"
            });
        }

        if (updates.instructor !== undefined) {
            updates.instructor = await validateInstructor(
                updates.instructor
            );
        }

        const course = await Course.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).populate("instructor", "instructorName email specialization");

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        return res.status(200).json({
            message: "Course updated successfully",
            course: course
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Course code already exists"
            });
        }

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                message: error.message
            });
        }

        next(error);
    }
}

// Delete a course only when no students are enrolled
async function deleteCourse(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        const studentCount = await Student.countDocuments({
            course: course._id
        });

        if (studentCount > 0) {
            return res.status(409).json({
                message:
                    "Cannot delete this course while students are enrolled. Reassign the students first."
            });
        }

        await Course.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Course deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};