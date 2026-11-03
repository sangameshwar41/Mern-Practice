
const Student = require("../models/Student");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// Get all students with search, filtering, sorting, and pagination
async function getAllStudents(req, res, next) {
    try {
        const {
            search,
            course,
            gender,
            sortBy = "createdAt",
            order = "desc",
            page = "1",
            limit = "10"
        } = req.query;

        // Validate page and limit
        const pageNumber = Number(page);
        const pageSize = Number(limit);

        if (
            !Number.isInteger(pageNumber) ||
            pageNumber < 1 ||
            !Number.isInteger(pageSize) ||
            ![10, 25, 50].includes(pageSize)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Page must be a positive integer and limit must be 10, 25, or 50"
            });
        }

        // Validate sorting options
        const allowedSortFields = ["fullName", "createdAt"];

        if (
            !allowedSortFields.includes(sortBy) ||
            !["asc", "desc"].includes(order)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid sorting options"
            });
        }

        // Build MongoDB filter
        const filter = {};

        // Search by name or email
        if (search !== undefined) {
            if (typeof search !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Search must be a string"
                });
            }

            const searchText = search.trim();

            if (searchText.length > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Search must not exceed 100 characters"
                });
            }

            if (searchText !== "") {
                const escapedSearch = searchText.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                );

                filter.$or = [
                    {
                        fullName: {
                            $regex: escapedSearch,
                            $options: "i"
                        }
                    },
                    {
                        email: {
                            $regex: escapedSearch,
                            $options: "i"
                        }
                    }
                ];
            }
        }

        // Filter by Course document ID
        if (course !== undefined && course !== "") {
            if (!mongoose.isObjectIdOrHexString(course)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid course ID"
                });
            }

            const existingCourse = await Course.findById(course);

            if (!existingCourse) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                });
            }

            filter.course = course;
        }

        // Filter by gender
        if (gender !== undefined && gender !== "") {
            const allowedGenders = ["Male", "Female", "Other"];

            if (!allowedGenders.includes(gender)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid gender value"
                });
            }

            filter.gender = gender;
        }

        // Calculate how many records to skip
        const skip = (pageNumber - 1) * pageSize;

        // Prepare sorting
        const sort = {};
        sort[sortBy] = order === "asc" ? 1 : -1;

        // Get students and their course details
        const students = await Student.find(filter)
            .populate("course", "courseName courseCode duration fee status")
            .sort(sort)
            .skip(skip)
            .limit(pageSize);

        // Count matching students
        const totalStudents = await Student.countDocuments(filter);
        const totalPages = Math.ceil(totalStudents / pageSize);

        return res.status(200).json({
            success: true,
            data: students,
            pagination: {
                totalStudents: totalStudents,
                currentPage: pageNumber,
                pageSize: pageSize,
                totalPages: totalPages
            }
        });
    } catch (error) {
        next(error);
    }
}

// Get one student by ID
async function getStudentById(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const student = await Student.findById(id)
            .populate("course", "courseName courseCode duration fee status");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        next(error);
    }
}

// Create a student
async function createStudent(req, res, next) {
    try {
        const {
            fullName,
            email,
            mobileNumber,
            gender,
            course,
            address
        } = req.body;

        if (
            !fullName ||
            !email ||
            !mobileNumber ||
            !gender ||
            !course ||
            !address
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required student fields"
            });
        }

        // Validate the Course document ID
        if (!mongoose.isObjectIdOrHexString(course)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID"
            });
        }

        // Make sure the selected Course exists
        const existingCourse = await Course.findById(course);

        if (!existingCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Only active courses can receive new students
        if (existingCourse.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Students can only enroll in active courses"
            });
        }

        const student = await Student.create({
            fullName,
            email,
            mobileNumber,
            gender,
            course,
            address
        });

        const populatedStudent = await Student.findById(student._id)
            .populate("course", "courseName courseCode duration fee status");

        return res.status(201).json({
            success: true,
            data: populatedStudent
        });
    } catch (error) {
        next(error);
    }
}

// Update selected student fields
async function updateStudent(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const allowedFields = [
            "fullName",
            "email",
            "mobileNumber",
            "gender",
            "course",
            "address"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update"
            });
        }

        // Validate the new Course reference if supplied
        if (updates.course !== undefined) {
            if (!mongoose.isObjectIdOrHexString(updates.course)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid course ID"
                });
            }

            const existingCourse = await Course.findById(updates.course);

            if (!existingCourse) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                });
            }

            if (existingCourse.status !== "active") {
                return res.status(400).json({
                    success: false,
                    message: "Students can only be assigned to active courses"
                });
            }
        }

        const student = await Student.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).populate("course", "courseName courseCode duration fee status");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        next(error);
    }
}

// Delete a student
async function deleteStudent(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const student = await Student.findByIdAndDelete(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

// Export controller functions
module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};
