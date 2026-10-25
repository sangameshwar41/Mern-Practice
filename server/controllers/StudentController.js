
const Student = require("../models/Student");
const mongoose = require("mongoose");

// Get all students
async function getAllStudents(req, res, next) {
    try {
        const students = await Student.find();

        res.status(200).json({
            success: true,
            data: students
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

        // Validate required fields
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
