require("dotenv").config();

const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");

const app = require("../app");

test("API home route should return success", async function () {
    const response = await request(app).get("/");

    assert.strictEqual(response.status, 200);
});

test("Unknown route should return 404", async function () {
    const response = await request(app).get("/invalid-route");

    assert.strictEqual(response.status, 404);
});

test("Students API should reject requests without authentication", async function () {
    const response = await request(app).get("/api/students");

    assert.strictEqual(response.status, 401);
});

test("Courses API should reject requests without authentication", async function () {
    const response = await request(app).get("/api/courses");

    assert.strictEqual(response.status, 401);
});
test("Users API should reject requests without authentication", async function () {
    const response = await request(app).get("/api/users");

    assert.strictEqual(response.status, 401);
});

test("Instructors API should reject requests without authentication", async function () {
    const response = await request(app).get("/api/instructors");

    assert.strictEqual(response.status, 401);
});

test("Reports API should reject requests without authentication", async function () {
    const response = await request(app).get("/api/reports");

    assert.strictEqual(response.status, 401);
});