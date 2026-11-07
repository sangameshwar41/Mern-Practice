
const test = require("node:test");
const assert = require("node:assert");

const Student = require("../models/Student");

test("Student model should accept valid student data", function () {
    const student = new Student({
        fullName: "Test Student",
        email: "test@example.com",
        mobileNumber: "9876543210",
        gender: "Male",
        course: "507f1f77bcf86cd799439011",
        address: "Hyderabad"
    });

    const error = student.validateSync();

    assert.strictEqual(error, undefined);
    assert.strictEqual(student.enrollmentStatus, "enrolled");
    assert.strictEqual(student.photo, null);
    assert.strictEqual(student.document, null);
});

test("Student model should reject missing required fields", function () {
    const student = new Student({});

    const error = student.validateSync();

    assert.ok(error);
    assert.ok(error.errors.fullName);
    assert.ok(error.errors.email);
    assert.ok(error.errors.mobileNumber);
    assert.ok(error.errors.gender);
    assert.ok(error.errors.course);
    assert.ok(error.errors.address);
});

test("Student model should reject invalid enrollment status", function () {
    const student = new Student({
        fullName: "Test Student",
        email: "test2@example.com",
        mobileNumber: "9876543210",
        gender: "Male",
        course: "507f1f77bcf86cd799439011",
        address: "Hyderabad",
        enrollmentStatus: "pending"
    });

    const error = student.validateSync();

    assert.ok(error);
    assert.ok(error.errors.enrollmentStatus);
});

test("Student model should define a unique email index", function () {
    const emailIndex = Student.schema.indexes().find(function (index) {
        return index[0].email === 1;
    });

    assert.ok(emailIndex);
    assert.strictEqual(emailIndex[1].unique, true);
});

test("Student model should define search and filter indexes", function () {
    const indexes = Student.schema.indexes();

    assert.ok(indexes.some(function (index) {
        return index[0].fullName === 1;
    }));

    assert.ok(indexes.some(function (index) {
        return index[0].course === 1;
    }));

    assert.ok(indexes.some(function (index) {
        return index[0].gender === 1;
    }));
});
