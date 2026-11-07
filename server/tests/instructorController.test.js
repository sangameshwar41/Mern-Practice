
const test = require("node:test");
const assert = require("node:assert/strict");

const Instructor = require("../models/Instructor");
const Course = require("../models/Course");

const {
    getAllInstructors,
    getInstructorById,
    createInstructor,
    updateInstructor,
    deleteInstructor
} = require("../controllers/InstructorController");

const validId = "507f1f77bcf86cd799439011";

function createResponse() {
    return {
        statusCode: null,
        body: null,

        status(code) {
            this.statusCode = code;
            return this;
        },

        json(data) {
            this.body = data;
            return this;
        }
    };
}

function replaceMethod(object, method, replacement) {
    const original = object[method];
    object[method] = replacement;

    return function restore() {
        object[method] = original;
    };
}

test("Get all instructors should return instructors with course counts", async function () {
    const instructor = {
        _id: validId,
        instructorName: "John",
        toObject() {
            return {
                _id: validId,
                instructorName: "John"
            };
        }
    };

    const restoreFind = replaceMethod(
        Instructor,
        "find",
        async function () {
            return [instructor];
        }
    );

    const restoreCount = replaceMethod(
        Course,
        "countDocuments",
        async function () {
            return 2;
        }
    );

    try {
        const res = createResponse();

        await getAllInstructors({}, res, function (error) {
            throw error;
        });

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.instructors.length, 1);
        assert.equal(res.body.instructors[0].courseCount, 2);
    } finally {
        restoreFind();
        restoreCount();
    }
});

test("Get instructor by ID should return instructor and assigned courses", async function () {
    const instructor = { _id: validId };
    const courses = [
        { courseName: "MERN" },
        { courseName: "React" }
    ];

    const restoreInstructor = replaceMethod(
        Instructor,
        "findById",
        async function () {
            return instructor;
        }
    );

    const restoreCourses = replaceMethod(
        Course,
        "find",
        function () {
            return {
                select: async function () {
                    return courses;
                }
            };
        }
    );

    try {
        const req = { params: { id: validId } };
        const res = createResponse();

        await getInstructorById(req, res, function (error) {
            throw error;
        });

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.courseCount, 2);
        assert.equal(res.body.courses.length, 2);
    } finally {
        restoreInstructor();
        restoreCourses();
    }
});

test("Get instructor by ID should reject an invalid ID", async function () {
    const req = { params: { id: "invalid-id" } };
    const res = createResponse();

    await getInstructorById(req, res, function (error) {
        throw error;
    });

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.message, "Invalid instructor ID");
});

test("Create instructor should reject missing required fields", async function () {
    const req = {
        body: {
            instructorName: "John"
        }
    };

    const res = createResponse();

    await createInstructor(req, res, function (error) {
        throw error;
    });

    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /required/i);
});

test("Create instructor should save a valid instructor", async function () {
    const restoreCreate = replaceMethod(
        Instructor,
        "create",
        async function (data) {
            return {
                ...data,
                _id: validId
            };
        }
    );

    try {
        const req = {
            body: {
                instructorName: "John",
                email: "john@example.com",
                specialization: "MERN Stack",
                experience: 3
            }
        };

        const res = createResponse();

        await createInstructor(req, res, function (error) {
            throw error;
        });

        assert.equal(res.statusCode, 201);
        assert.equal(res.body.instructor.instructorName, "John");
        assert.equal(res.body.instructor.email, "john@example.com");
    } finally {
        restoreCreate();
    }
});

test("Create instructor should reject duplicate email", async function () {
    const restoreCreate = replaceMethod(
        Instructor,
        "create",
        async function () {
            const error = new Error("Duplicate email");
            error.code = 11000;
            throw error;
        }
    );

    try {
        const req = {
            body: {
                instructorName: "John",
                email: "john@example.com",
                specialization: "MERN Stack",
                experience: 3
            }
        };

        const res = createResponse();

        await createInstructor(req, res, function (error) {
            throw error;
        });

        assert.equal(res.statusCode, 409);
        assert.match(res.body.message, /email already exists/i);
    } finally {
        restoreCreate();
    }
});

test("Update instructor should save valid changes", async function () {
    const restoreUpdate = replaceMethod(
        Instructor,
        "findByIdAndUpdate",
        async function () {
            return {
                _id: validId,
                instructorName: "Updated John"
            };
        }
    );

    try {
        const req = {
            params: { id: validId },
            body: {
                instructorName: "Updated John"
            }
        };

        const res = createResponse();

        await updateInstructor(req, res, function (error) {
            throw error;
        });

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.instructor.instructorName, "Updated John");
    } finally {
        restoreUpdate();
    }
});

test("Update instructor should reject an empty update", async function () {
    const req = {
        params: { id: validId },
        body: {}
    };

    const res = createResponse();

    await updateInstructor(req, res, function (error) {
        throw error;
    });

    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /No valid fields/i);
});

test("Delete instructor should reject deletion when courses are assigned", async function () {
    const restoreInstructor = replaceMethod(
        Instructor,
        "findById",
        async function () {
            return { _id: validId };
        }
    );

    const restoreCount = replaceMethod(
        Course,
        "countDocuments",
        async function () {
            return 2;
        }
    );

    try {
        const req = { params: { id: validId } };
        const res = createResponse();

        await deleteInstructor(req, res, function (error) {
            throw error;
        });

        assert.equal(res.statusCode, 409);
        assert.match(res.body.message, /courses are assigned/i);
    } finally {
        restoreInstructor();
        restoreCount();
    }
});

test("Delete instructor should delete an instructor with no assigned courses", async function () {
    let deleteCalled = false;

    const restoreInstructor = replaceMethod(
        Instructor,
        "findById",
        async function () {
            return { _id: validId };
        }
    );

    const restoreCount = replaceMethod(
        Course,
        "countDocuments",
        async function () {
            return 0;
        }
    );

    const restoreDelete = replaceMethod(
        Instructor,
        "findByIdAndDelete",
        async function () {
            deleteCalled = true;
        }
    );

    try {
        const req = { params: { id: validId } };
        const res = createResponse();

        await deleteInstructor(req, res, function (error) {
            throw error;
        });

        assert.equal(res.statusCode, 200);
        assert.equal(deleteCalled, true);
        assert.equal(res.body.message, "Instructor deleted successfully");
    } finally {
        restoreInstructor();
        restoreCount();
        restoreDelete();
    }
});
