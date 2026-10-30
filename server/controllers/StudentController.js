const Student = require("../models/Student");
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

        // Filter by course
        if (course !== undefined) {
            const allowedCourses = [
                "CSE",
                "ECE",
                "EEE",
                "MERN Stack Development"
            ];

            if (
                typeof course !== "string" ||
                !allowedCourses.includes(course)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid course value"
                });
            }

            filter.course = course;
        }

        // Filter by gender
        if (gender !== undefined) {
            const allowedGenders = ["Male", "Female", "Other"];

            if (
                typeof gender !== "string" ||
                !allowedGenders.includes(gender)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid gender value"
                });
            }

            filter.gender = gender;
        }

        // Calculate records to skip
        const skip = (pageNumber - 1) * pageSize;

        // Prepare sorting
        const sort = {};
        sort[sortBy] = order === "asc" ? 1 : -1;

        // Get students for the requested page
        const students = await Student.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageSize);

        // Count matching students
        const totalStudents = await Student.countDocuments(filter);
        const totalPages = Math.ceil(totalStudents / pageSize);

        // Send response
        res.status(200).json({
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

// Get a student by ID
async function getStudentById(req, res, next) {
    try {
        if (!mongoose.isObjectIdOrHexString(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
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

        const student = await Student.create({
            fullName,
            email,
            mobileNumber,
            gender,
            course,
            address
        });

        res.status(201).json({
            success: true,
            data: student
        });
    } catch (error) {
        next(error);
    }
}

// Update selected student fields
async function updateStudent(req, res, next) {
    try {
        if (!mongoose.isObjectIdOrHexString(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
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
        if (!mongoose.isObjectIdOrHexString(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

// Export all controller functions
module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};