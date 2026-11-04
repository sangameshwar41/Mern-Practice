
const Student = require("../models/Student");
const Course = require("../models/Course");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const photoFolder = path.join(
    __dirname,
    "../uploads/students/photos"
);

const documentFolder = path.join(
    __dirname,
    "../uploads/students/documents"
);

// Remove an uploaded photo after an unsuccessful operation
function removeUploadedPhoto(filename) {
    if (!filename) {
        return;
    }

    const filePath = path.join(
        photoFolder,
        path.basename(filename)
    );

    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error("Failed to remove uploaded photo:", error);
    }
}

// Remove an uploaded document after an unsuccessful operation
function removeUploadedDocument(filename) {
    if (!filename) {
        return;
    }

    const filePath = path.join(
        documentFolder,
        path.basename(filename)
    );

    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error("Failed to remove uploaded document:", error);
    }
}

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

        const filter = {};

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

        const skip = (pageNumber - 1) * pageSize;

        const sort = {};
        sort[sortBy] = order === "asc" ? 1 : -1;

        const students = await Student.find(filter)
            .populate(
                "course",
                "courseName courseCode duration fee status"
            )
            .sort(sort)
            .skip(skip)
            .limit(pageSize);

        const totalStudents = await Student.countDocuments(filter);
        const totalPages = Math.ceil(totalStudents / pageSize);

        return res.status(200).json({
            success: true,
            data: students,
            pagination: {
                totalStudents,
                currentPage: pageNumber,
                pageSize,
                totalPages
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
            .populate(
                "course",
                "courseName courseCode duration fee status"
            );

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

// Display a student's photo
async function getStudentPhoto(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (!student.photo) {
            return res.status(404).json({
                success: false,
                message: "No photo uploaded for this student"
            });
        }

        const filename = path.basename(student.photo);
        const filePath = path.join(photoFolder, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "Photo file not found"
            });
        }

        res.setHeader("Cache-Control", "private, no-store");

        return res.sendFile(filePath);
    } catch (error) {
        next(error);
    }
}

// Create a student with an optional photo
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
            removeUploadedPhoto(req.file?.filename);

            return res.status(400).json({
                success: false,
                message: "Please provide all required student fields"
            });
        }

        if (!mongoose.isObjectIdOrHexString(course)) {
            removeUploadedPhoto(req.file?.filename);

            return res.status(400).json({
                success: false,
                message: "Invalid course ID"
            });
        }

        const existingCourse = await Course.findById(course);

        if (!existingCourse) {
            removeUploadedPhoto(req.file?.filename);

            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        if (existingCourse.status !== "active") {
            removeUploadedPhoto(req.file?.filename);

            return res.status(400).json({
                success: false,
                message:
                    "Students can only enroll in active courses"
            });
        }

        const student = await Student.create({
            fullName,
            email,
            mobileNumber,
            gender,
            course,
            address,
            photo: req.file
                ? `uploads/students/photos/${req.file.filename}`
                : null
        });

        const populatedStudent = await Student.findById(student._id)
            .populate(
                "course",
                "courseName courseCode duration fee status"
            );

        return res.status(201).json({
            success: true,
            data: populatedStudent
        });
    } catch (error) {
        removeUploadedPhoto(req.file?.filename);
        next(error);
    }
}

// Update student details and optionally replace the photo
async function updateStudent(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            removeUploadedPhoto(req.file?.filename);

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

        if (req.file) {
            updates.photo =
                `uploads/students/photos/${req.file.filename}`;
        }

        if (Object.keys(updates).length === 0) {
            removeUploadedPhoto(req.file?.filename);

            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update"
            });
        }

        if (updates.course !== undefined) {
            if (!mongoose.isObjectIdOrHexString(updates.course)) {
                removeUploadedPhoto(req.file?.filename);

                return res.status(400).json({
                    success: false,
                    message: "Invalid course ID"
                });
            }

            const existingCourse = await Course.findById(updates.course);

            if (!existingCourse) {
                removeUploadedPhoto(req.file?.filename);

                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                });
            }

            if (existingCourse.status !== "active") {
                removeUploadedPhoto(req.file?.filename);

                return res.status(400).json({
                    success: false,
                    message:
                        "Students can only be assigned to active courses"
                });
            }
        }

        const existingStudent = await Student.findById(id);

        if (!existingStudent) {
            removeUploadedPhoto(req.file?.filename);

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const previousPhoto = existingStudent.photo;

        const student = await Student.findByIdAndUpdate(
            id,
            updates,
            {
                returnDocument: "after",
                runValidators: true
            }
        ).populate(
            "course",
            "courseName courseCode duration fee status"
        );

        if (
            req.file &&
            previousPhoto &&
            previousPhoto !== updates.photo
        ) {
            removeUploadedPhoto(path.basename(previousPhoto));
        }

        return res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        removeUploadedPhoto(req.file?.filename);
        next(error);
    }
}

// Upload or replace a student's PDF document
async function uploadStudentDocument(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            removeUploadedDocument(req.file?.filename);

            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select a PDF document"
            });
        }

        const student = await Student.findById(id);

        if (!student) {
            removeUploadedDocument(req.file.filename);

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const previousDocument = student.document;

        student.document =
            `uploads/students/documents/${req.file.filename}`;

        await student.save();

        if (previousDocument) {
            removeUploadedDocument(
                path.basename(previousDocument)
            );
        }

        return res.status(200).json({
            success: true,
            message: "Student document uploaded successfully",
            data: {
                studentId: student._id,
                document: student.document
            }
        });
    } catch (error) {
        removeUploadedDocument(req.file?.filename);
        next(error);
    }
}

// Download the uploaded PDF document
async function downloadStudentDocument(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const student = await Student.findById(id).maxTimeMS(5000);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (!student.document) {
            return res.status(404).json({
                success: false,
                message: "No document has been uploaded for this student"
            });
        }

        const filename = path.basename(student.document);
        const filePath = path.join(documentFolder, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "Document file not found"
            });
        }

        return res.download(filePath, filename, function (error) {
            if (error && !res.headersSent) {
                next(error);
            }
        });
    } catch (error) {
        next(error);
    }
}

// Remove a student's photo without deleting the student
async function removeStudentPhoto(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (!student.photo) {
            return res.status(404).json({
                success: false,
                message: "No photo uploaded for this student"
            });
        }

        const previousPhoto = student.photo;

        student.photo = null;
        await student.save();

        removeUploadedPhoto(path.basename(previousPhoto));

        return res.status(200).json({
            success: true,
            message: "Student photo removed successfully"
        });
    } catch (error) {
        next(error);
    }
}

// Remove a student's PDF without deleting the student
async function removeStudentDocument(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (!student.document) {
            return res.status(404).json({
                success: false,
                message: "No document uploaded for this student"
            });
        }

        const previousDocument = student.document;

        student.document = null;
        await student.save();

        removeUploadedDocument(path.basename(previousDocument));

        return res.status(200).json({
            success: true,
            message: "Student document removed successfully"
        });
    } catch (error) {
        next(error);
    }
}

// Delete a student and their uploaded files
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

        if (student.photo) {
            removeUploadedPhoto(path.basename(student.photo));
        }

        if (student.document) {
            removeUploadedDocument(path.basename(student.document));
        }

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllStudents,
    getStudentById,
    getStudentPhoto,
    createStudent,
    updateStudent,
    uploadStudentDocument,
    downloadStudentDocument,
    removeStudentPhoto,
    removeStudentDocument,
    deleteStudent
};
