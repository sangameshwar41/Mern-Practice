
const test = require("node:test");
const assert = require("node:assert");

const validateObjectId = require("../middleware/validateObjectId");

function runValidation(id) {
    const req = {
        params: { id: id }
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

    validateObjectId()(req, res, function () {
        nextCalled = true;
    });

    return { res, nextCalled };
}

test("Valid MongoDB ID should pass validation", function () {
    const result = runValidation("507f1f77bcf86cd799439011");

    assert.strictEqual(result.nextCalled, true);
});

test("Invalid MongoDB ID should return 400", function () {
    const result = runValidation("invalid-id");

    assert.strictEqual(result.res.statusCode, 400);
    assert.strictEqual(result.res.message, "Invalid MongoDB ID");
});

test("Missing MongoDB ID should return 400", function () {
    const result = runValidation(undefined);

    assert.strictEqual(result.res.statusCode, 400);
});

test("MongoDB ID with incorrect length should return 400", function () {
    const result = runValidation("507f1f77bcf86cd7994390");

    assert.strictEqual(result.res.statusCode, 400);
});
