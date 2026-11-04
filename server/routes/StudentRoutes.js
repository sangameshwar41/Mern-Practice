
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    uploadPhoto,
    uploadDocument
} = require("../middleware/uploadMiddleware");

const {
    getAllStudents,
    getStudentById,
    getStudentPhoto,
    createStudent,
    updateStudent,
    deleteStudent,
    uploadStudentDocument,
    downloadStudentDocument,
    removeStudentPhoto,
    removeStudentDocument
} = require("../controllers/StudentController");

// Require a valid login token for all student routes
router.use(authMiddleware);

// Admin, Staff, and Viewer can view all students
router.get(
    "/",
    authorizeRoles("admin", "staff", "viewer"),
    getAllStudents
);

// Admin, Staff, and Viewer can view one student
router.get(
    "/:id",
    authorizeRoles("admin", "staff", "viewer"),
    getStudentById
);

// Admin, Staff, and Viewer can view a student's photo
router.get(
    "/:id/photo",
    authorizeRoles("admin", "staff", "viewer"),
    getStudentPhoto
);

// Admin and Staff can create students with an optional photo
router.post(
    "/",
    authorizeRoles("admin", "staff"),
    uploadPhoto.single("photo"),
    createStudent
);

// Admin and Staff can update student details and optionally replace a photo
router.patch(
    "/:id",
    authorizeRoles("admin", "staff"),
    uploadPhoto.single("photo"),
    updateStudent
);

// Admin and Staff can upload a PDF document
router.post(
    "/:id/document",
    authorizeRoles("admin", "staff"),
    uploadDocument.single("document"),
    uploadStudentDocument
);

// Admin and Staff can download a private PDF document
router.get(
    "/:id/document",
    authorizeRoles("admin", "staff"),
    downloadStudentDocument
);

// Admin and Staff can remove a student's photo
router.delete(
    "/:id/photo",
    authorizeRoles("admin", "staff"),
    removeStudentPhoto
);

// Admin and Staff can remove a student's PDF document
router.delete(
    "/:id/document",
    authorizeRoles("admin", "staff"),
    removeStudentDocument
);

// Only Admin can delete students
router.delete(
    "/:id",
    authorizeRoles("admin"),
    deleteStudent
);

module.exports = router;
