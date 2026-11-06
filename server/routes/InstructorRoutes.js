const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");

const {
    instructorSchema,
    instructorUpdateSchema
} = require("../validators/instructorValidator");

const {
    getAllInstructors,
    getInstructorById,
    createInstructor,
    updateInstructor,
    deleteInstructor
} = require("../controllers/InstructorController");

router.use(authMiddleware);

router.get(
    "/",
    authorizeRoles("admin", "staff", "viewer"),
    getAllInstructors
);

router.get(
    "/:id",
    authorizeRoles("admin", "staff", "viewer"),
    validateObjectId(),
    getInstructorById
);

router.post(
    "/",
    authorizeRoles("admin"),
    validate(instructorSchema),
    createInstructor
);

router.patch(
    "/:id",
    authorizeRoles("admin"),
    validateObjectId(),
    validate(instructorUpdateSchema),
    updateInstructor
);

router.delete(
    "/:id",
    authorizeRoles("admin"),
    validateObjectId(),
    deleteInstructor
);

module.exports = router;