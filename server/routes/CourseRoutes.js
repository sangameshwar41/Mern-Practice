const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");

const {
    courseSchema,
    courseUpdateSchema
} = require("../validators/courseValidator");

const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/CourseController");

router.use(authMiddleware);

router.get(
    "/",
    authorizeRoles("admin", "staff", "viewer"),
    getAllCourses
);

router.get(
    "/:id",
    authorizeRoles("admin", "staff", "viewer"),
    validateObjectId(),
    getCourseById
);

router.post(
    "/",
    authorizeRoles("admin"),
    validate(courseSchema),
    createCourse
);

router.patch(
    "/:id",
    authorizeRoles("admin"),
    validateObjectId(),
    validate(courseUpdateSchema),
    updateCourse
);

router.delete(
    "/:id",
    authorizeRoles("admin"),
    validateObjectId(),
    deleteCourse
);

module.exports = router;