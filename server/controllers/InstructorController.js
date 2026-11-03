
const Instructor = require("../models/Instructor");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// Get all instructors and their course counts
async function getAllInstructors(req, res, next) {
    try {
        const instructors = await Instructor.find();

        const instructorsWithCounts = await Promise.all(
            instructors.map(async function (instructor) {
                const courseCount = await Course.countDocuments({
                    instructor: instructor._id
                });

                return {
                    ...instructor.toObject(),
                    courseCount: courseCount
                };
            })
        );

        return res.status(200).json({
            message: "Instructors retrieved successfully",
            instructors: instructorsWithCounts
        });
    } catch (error) {
        next(error);
    }
}

// Get one instructor by ID
async function getInstructorById(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: "Invalid instructor ID"
            });
        }

        const instructor = await Instructor.findById(id);

        if (!instructor) {
            return res.status(404).json({
                message: "Instructor not found"
            });
        }

        const courses = await Course.find({ instructor: instructor._id })
            .select("courseName courseCode duration fee status");

        return res.status(200).json({
            message: "Instructor retrieved successfully",
            instructor: instructor,
            courseCount: courses.length,
            courses: courses
        });
    } catch (error) {
        next(error);
    }
}

// Create an instructor
async function createInstructor(req, res, next) {
    try {
        const {
            instructorName,
            email,
            specialization,
            experience
        } = req.body;

        if (!instructorName || !email || !specialization || experience === undefined || experience === null || experience === "") {
            return res.status(400).json({
                message: "Instructor name, email, specialization, and experience are required"
            });
        }

        const instructor = await Instructor.create({
            instructorName,
            email,
            specialization,
            experience
        });

        return res.status(201).json({
            message: "Instructor created successfully",
            instructor: instructor
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "An instructor with this email already exists"
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

// Update an instructor
async function updateInstructor(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: "Invalid instructor ID"
            });
        }

        const allowedFields = [
            "instructorName",
            "email",
            "specialization",
            "experience"
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

        const instructor = await Instructor.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!instructor) {
            return res.status(404).json({
                message: "Instructor not found"
            });
        }

        return res.status(200).json({
            message: "Instructor updated successfully",
            instructor: instructor
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "An instructor with this email already exists"
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

// Delete an instructor only if no courses are assigned
async function deleteInstructor(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: "Invalid instructor ID"
            });
        }

        const instructor = await Instructor.findById(id);

        if (!instructor) {
            return res.status(404).json({
                message: "Instructor not found"
            });
        }

        const courseCount = await Course.countDocuments({
            instructor: instructor._id
        });

        if (courseCount > 0) {
            return res.status(409).json({
                message: "Cannot delete this instructor while courses are assigned. Reassign the courses first."
            });
        }

        await Instructor.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Instructor deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllInstructors,
    getInstructorById,
    createInstructor,
    updateInstructor,
    deleteInstructor
};
