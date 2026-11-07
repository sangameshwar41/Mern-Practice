
const test = require("node:test");
const assert = require("node:assert");

const Course = require("../models/Course");

test("Course model should accept valid course data", function () {
    const course = new Course({
        courseName: "MERN Stack Development",
        courseCode: "mern101",
        duration: "6 Months",
        fee: 25000
    });

    const error = course.validateSync();

    assert.strictEqual(error, undefined);
    assert.strictEqual(course.courseCode, "MERN101");
    assert.strictEqual(course.status, "active");
});

test("Course model should reject missing required fields", function () {
    const course = new Course({});

    const error = course.validateSync();

    assert.ok(error);
    assert.ok(error.errors.courseName);
    assert.ok(error.errors.courseCode);
    assert.ok(error.errors.duration);
    assert.ok(error.errors.fee);
});

test("Course model should reject negative fee", function () {
    const course = new Course({
        courseName: "React",
        courseCode: "REACT101",
        duration: "3 Months",
        fee: -100
    });

    const error = course.validateSync();

    assert.ok(error);
    assert.ok(error.errors.fee);
});

test("Course model should reject invalid status", function () {
    const course = new Course({
        courseName: "Node.js",
        courseCode: "NODE101",
        duration: "3 Months",
        fee: 10000,
        status: "pending"
    });

    const error = course.validateSync();

    assert.ok(error);
    assert.ok(error.errors.status);
});

test("Course model should trim course name and duration", function () {
    const course = new Course({
        courseName: "  MongoDB  ",
        courseCode: "mongo101",
        duration: "  2 Months  ",
        fee: 5000
    });

    assert.strictEqual(course.courseName, "MongoDB");
    assert.strictEqual(course.duration, "2 Months");
});
