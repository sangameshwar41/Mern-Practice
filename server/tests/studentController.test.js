
const test = require("node:test");
const assert = require("node:assert");

const Student = require("../models/Student");
const studentController = require("../controllers/StudentController");

function createResponse() {
    return {
        statusCode: 200,
        body: null,

        status: function (code) {
            this.statusCode = code;
            return this;
        },

        json: function (data) {
            this.body = data;
            return this;
        }
    };
}

function replaceMethod(object, method, replacement) {
    const original = object[method];
    object[method] = replacement;

    return function () {
        object[method] = original;
    };
}

test("Student listing should support search and pagination", async function () {
    let capturedFilter;
    let capturedSkip;
    let capturedLimit;

    const restoreFind = replaceMethod(Student, "find", function (filter) {
        capturedFilter = filter;

        return {
            populate: function () { return this; },
            sort: function () { return this; },
            skip: function (value) {
                capturedSkip = value;
                return this;
            },
            limit: function (value) {
                capturedLimit = value;
                return Promise.resolve([]);
            }
        };
    });

    const restoreCount = replaceMethod(
        Student,
        "countDocuments",
        async function () {
            return 11;
        }
    );

    try {
        const req = {
            query: {
                search: "Alex",
                gender: "Male",
                page: "2",
                limit: "10"
            }
        };

        const res = createResponse();

        await studentController.getAllStudents(req, res, function (error) {
            throw error;
        });

        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(capturedFilter.gender, "Male");
        assert.ok(capturedFilter.$or);
        assert.strictEqual(capturedSkip, 10);
        assert.strictEqual(capturedLimit, 10);
        assert.strictEqual(res.body.pagination.totalStudents, 11);
        assert.strictEqual(res.body.pagination.totalPages, 2);
    } finally {
        restoreFind();
        restoreCount();
    }
});

test("Student listing should reject an invalid page number", async function () {
    const req = { query: { page: "0", limit: "10" } };
    const res = createResponse();

    await studentController.getAllStudents(req, res, function (error) {
        throw error;
    });

    assert.strictEqual(res.statusCode, 400);
});

test("Get student by ID should return the student", async function () {
    const student = {
        _id: "507f1f77bcf86cd799439011",
        fullName: "Test Student"
    };

    const restore = replaceMethod(Student, "findById", function () {
        return {
            populate: async function () {
                return student;
            }
        };
    });

    try {
        const req = {
            params: { id: "507f1f77bcf86cd799439011" }
        };

        const res = createResponse();

        await studentController.getStudentById(req, res, function (error) {
            throw error;
        });

        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.body.data.fullName, "Test Student");
    } finally {
        restore();
    }
});

test("Update student should save valid changes", async function () {
    const existingStudent = { photo: null };
    const updatedStudent = { fullName: "Updated Student" };

    const restoreFind = replaceMethod(
        Student,
        "findById",
        async function () {
            return existingStudent;
        }
    );

    const restoreUpdate = replaceMethod(
        Student,
        "findByIdAndUpdate",
        function () {
            return {
                populate: async function () {
                    return updatedStudent;
                }
            };
        }
    );

    try {
        const req = {
            params: { id: "507f1f77bcf86cd799439011" },
            body: { fullName: "Updated Student" }
        };

        const res = createResponse();

        await studentController.updateStudent(req, res, function (error) {
            throw error;
        });

        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.body.data.fullName, "Updated Student");
    } finally {
        restoreFind();
        restoreUpdate();
    }
});

test("Delete student should return success", async function () {
    const restore = replaceMethod(
        Student,
        "findByIdAndDelete",
        async function () {
            return {
                photo: null,
                document: null
            };
        }
    );

    try {
        const req = {
            params: { id: "507f1f77bcf86cd799439011" }
        };

        const res = createResponse();

        await studentController.deleteStudent(req, res, function (error) {
            throw error;
        });

        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(
            res.body.message,
            "Student deleted successfully"
        );
    } finally {
        restore();
    }
});
