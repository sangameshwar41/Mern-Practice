
const test = require("node:test");
const assert = require("node:assert/strict");

const Course = require("../models/Course");
const Student = require("../models/Student");
const Instructor = require("../models/Instructor");

const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/CourseController");

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

test("Get all courses should return courses with student counts", async function () {
    const course = {
        _id: validId,
        courseName: "MERN Stack",
        toObject() {
            return {
                _id: validId,
                courseName: "MERN Stack"
            };
        }
    };

    const restoreFind = replaceMethod(Course, "find", function () {
        return {
            populate: async function () {
                return [course];
            }
        };
    });

    const restoreCount = replaceMethod(
        Student,
        "countDocuments",
        async function () {
            return 3;
        }
    );

    try {
        const req = {};
        const res = createResponse();

        await getAllCourses(req, res, function (error) {
            throw error;
        });

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.courses.length, 1);
        assert.equal(res.body.courses[0].studentCount, 3);
    } finally {
        restoreFind();
        restoreCount();
    }
});

test("Get course by ID should return the course and enrolled students", async function () {
    const course = { _id: validId };
    const students = [
        { fullName: "Student One" },
        { fullName: "Student Two" }
    ];

    const restoreCourse = replaceMethod(
        Course,
        "findById",
        function () {
            return {
                populate: async function () {
                    return course;
                }
            };
        }
    );

    const restoreStudents = replaceMethod(
        Student,
        "find",
        function () {
            return {
                select: async function () {
                    return students;
                }
            };
        }
    );

    try {
        const req = { params: { id: validId } };
        const res = createResponse();

        await getCourseById(req, res, function (error) {
            throw error;
        });

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.studentCount, 2);
        assert.equal(res.body.students.length, 2);
    } finally {
        restoreCourse();
        restoreStudents();
    }
});

test("Get course by ID should reject an invalid ID", async function () {
    const req = { params: { id: "invalid-id" } };
    const res = createResponse();

    await getCourseById(req, res, function (error) {
        throw error;
    });

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.message, "Invalid course ID");
});

test("Create course should reject missing required fields", async function () {
    const req = {
        body: {
            courseName: "MERN Stack"
        }
    };

    const res = createResponse();

    await createCourse(req, res, function (error) {
        throw error;
    });

    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /required/i);
});

test("Create course should save a valid course", async function () {
    const newCourse = {
        _id: validId,
        courseName: "MERN Stack",
        courseCode: "MERN101"
    };

    const restoreCreate = replaceMethod(
        Course,
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
                courseName: "MERN Stack",
                courseCode: "MERN101",
                duration: "6 months",
                fee: 10000,
                instructor: null
            }
        };

        const res = createResponse();

        await createCourse(req, res, function (error) {
            throw error;
        });

        assert.equal(res.statusCode, 201);
        assert.equal(res.body.course.courseName, newCourse.courseName);
        assert.equal(res.body.course.courseCode, newCourse.courseCode);
    } finally {
        restoreCreate();
    }
});

test("Update course should save valid changes", async function () {
    const updatedCourse = {
        _id: validId,
        courseName: "Updated MERN Course"
    };

    const restoreUpdate = replaceMethod(
        Course,
        "findByIdAndUpdate",
        function () {
            return {
                populate: async function () {
                    return updatedCourse;
                }
            };
        }
    );

    try {
        const req = {
            params: { id: validId },
            body: {
                courseName: "Updated MERN Course"
            }
        };

        const res = createResponse();

        await updateCourse(req, res, function (error) {
            throw error;
        });

        assert.equal(res.statusCode, 200);
        assert.equal(
            res.body.course.courseName,
            "Updated MERN Course"
        );
    } finally {
        restoreUpdate();
    }
});

test("Delete course should reject deletion when students are enrolled", async function () {
    const restoreCourse = replaceMethod(
        Course,
        "findById",
        async function () {
            return { _id: validId };
        }
    );

    const restoreCount = replaceMethod(
        Student,
        "countDocuments",
        async function () {
            return 2;
        }
    );

    try {
        const req = { params: { id: validId } };
        const res = createResponse();

        await deleteCourse(req, res, function (error) {
            throw error;
        });

        assert.equal(res.statusCode, 409);
        assert.match(res.body.message, /students are enrolled/i);
    } finally {
        restoreCourse();
        restoreCount();
    }
});

test("Delete course should delete a course with no enrolled students", async function () {
    let deleteCalled = false;

    const restoreCourse = replaceMethod(
        Course,
        "findById",
        async function () {
            return { _id: validId };
        }
    );

    const restoreCount = replaceMethod(
        Student,
        "countDocuments",
        async function () {
            return 0;
        }
    );

    const restoreDelete = replaceMethod(
        Course,
        "findByIdAndDelete",
        async function () {
            deleteCalled = true;
        }
    );

    try {
        const req = { params: { id: validId } };
        const res = createResponse();

        await deleteCourse(req, res, function (error) {
            throw error;
        });

        assert.equal(res.statusCode, 200);
        assert.equal(deleteCalled, true);
        assert.equal(res.body.message, "Course deleted successfully");
    } finally {
        restoreCourse();
        restoreCount();
        restoreDelete();
    }
});
