
const test = require("node:test");
const assert = require("node:assert");

const authorizeRoles = require("../middleware/roleMiddleware");

function runMiddleware(role, allowedRoles) {
    const req = {
        user: role ? { role: role } : null
    };

    const res = {
        statusCode: 200,
        message: null,

        status: function (code) {
            this.statusCode = code;
            return this;
        },

        json: function (data) {
            this.message = data.message;
            return this;
        }
    };

    let nextCalled = false;

    const next = function () {
        nextCalled = true;
    };

    authorizeRoles(...allowedRoles)(req, res, next);

    return { res, nextCalled };
}

test("Admin should access admin routes", function () {
    const result = runMiddleware("admin", ["admin"]);

    assert.strictEqual(result.nextCalled, true);
});

test("Staff should be denied admin-only routes", function () {
    const result = runMiddleware("staff", ["admin"]);

    assert.strictEqual(result.res.statusCode, 403);
});

test("Viewer should be denied admin-only routes", function () {
    const result = runMiddleware("viewer", ["admin"]);

    assert.strictEqual(result.res.statusCode, 403);
});

test("Viewer should access routes allowing viewers", function () {
    const result = runMiddleware(
        "viewer",
        ["admin", "staff", "viewer"]
    );

    assert.strictEqual(result.nextCalled, true);
});

test("Unauthenticated user should receive 401", function () {
    const result = runMiddleware(null, ["admin"]);

    assert.strictEqual(result.res.statusCode, 401);
});
