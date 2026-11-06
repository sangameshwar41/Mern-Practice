const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");

const {
    studentSchema,
    studentUpdateSchema
} = require("../validators/studentValidator");

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

router.use(authMiddleware);

router.get(
    "/",
    authorizeRoles("admin", "staff", "viewer"),
    getAllStudents
);

router.get(
    "/:id",
    authorizeRoles("admin", "staff", "viewer"),
    validateObjectId(),
    getStudentById
);

router.get(
    "/:id/photo",
    authorizeRoles("admin", "staff", "viewer"),
    validateObjectId(),
    getStudentPhoto
);

router.post(
    "/",
    authorizeRoles("admin", "staff"),
    uploadPhoto.single("photo"),
    validate(studentSchema),
    createStudent
);

router.patch(
    "/:id",
    authorizeRoles("admin", "staff"),
    validateObjectId(),
    uploadPhoto.single("photo"),
    validate(studentUpdateSchema),
    updateStudent
);

router.post(
    "/:id/document",
    authorizeRoles("admin", "staff"),
    validateObjectId(),
    uploadDocument.single("document"),
    uploadStudentDocument
);

router.get(
    "/:id/document",
    authorizeRoles("admin", "staff"),
    validateObjectId(),
    downloadStudentDocument
);

router.delete(
    "/:id/photo",
    authorizeRoles("admin", "staff"),
    validateObjectId(),
    removeStudentPhoto
);

router.delete(
    "/:id/document",
    authorizeRoles("admin", "staff"),
    validateObjectId(),
    removeStudentDocument
);

router.delete(
    "/:id",
    authorizeRoles("admin"),
    validateObjectId(),
    deleteStudent
);

module.exports = router;