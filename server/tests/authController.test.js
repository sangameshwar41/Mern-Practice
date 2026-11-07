
const test = require("node:test");
const assert = require("node:assert/strict");

const User = require("../models/User");
const bcrypt = require("bcryptjs");

const {
    registerUser,
    loginUser,
    getUserProfile,
    changePassword,
    forgotPassword,
    resetPassword
} = require("../controllers/AuthController");

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

test("Register should reject missing fields", async function () {
    const req = { body: {} };
    const res = createResponse();

    await registerUser(req, res);

    assert.equal(res.statusCode, 400);
});

test("Register should reject a short username", async function () {
    const req = {
        body: {
            username: "ab",
            email: "test@example.com",
            password: "password123"
        }
    };

    const res = createResponse();

    await registerUser(req, res);

    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /username/i);
});

test("Register should reject an invalid email", async function () {
    const req = {
        body: {
            username: "Test User",
            email: "invalid-email",
            password: "password123"
        }
    };

    const res = createResponse();

    await registerUser(req, res);

    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /valid email/i);
});

test("Register should reject a short password", async function () {
    const req = {
        body: {
            username: "Test User",
            email: "test@example.com",
            password: "123"
        }
    };

    const res = createResponse();

    await registerUser(req, res);

    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /8 characters/i);
});

test("Register should reject an existing user", async function () {
    const restore = replaceMethod(
        User,
        "findOne",
        async function () {
            return { username: "Test User" };
        }
    );

    try {
        const req = {
            body: {
                username: "Test User",
                email: "test@example.com",
                password: "password123"
            }
        };

        const res = createResponse();

        await registerUser(req, res);

        assert.equal(res.statusCode, 409);
    } finally {
        restore();
    }
});

test("Register should create a user successfully", async function () {
    const restoreFind = replaceMethod(
        User,
        "findOne",
        async function () {
            return null;
        }
    );

    const restoreCreate = replaceMethod(
        User,
        "create",
        async function (data) {
            return {
                _id: "user123",
                username: data.username,
                email: data.email
            };
        }
    );

    try {
        const req = {
            body: {
                username: "Test User",
                email: "TEST@example.com",
                password: "password123"
            }
        };

        const res = createResponse();

        await registerUser(req, res);

        assert.equal(res.statusCode, 201);
        assert.equal(res.body.user.username, "Test User");
        assert.equal(res.body.user.email, "test@example.com");
    } finally {
        restoreFind();
        restoreCreate();
    }
});

test("Login should reject missing credentials", async function () {
    const req = { body: {} };
    const res = createResponse();

    await loginUser(req, res);

    assert.equal(res.statusCode, 400);
});

test("Login should reject an unknown email", async function () {
    const restore = replaceMethod(
        User,
        "findOne",
        function () {
            return {
                select: async function () {
                    return null;
                }
            };
        }
    );

    try {
        const req = {
            body: {
                email: "unknown@example.com",
                password: "password123"
            }
        };

        const res = createResponse();

        await loginUser(req, res);

        assert.equal(res.statusCode, 401);
        assert.match(res.body.message, /Invalid email or password/i);
    } finally {
        restore();
    }
});

test("Login should reject an incorrect password", async function () {
    const restoreFind = replaceMethod(
        User,
        "findOne",
        function () {
            return {
                select: async function () {
                    return {
                        _id: "user123",
                        password: "hashed-password"
                    };
                }
            };
        }
    );

    const restoreCompare = replaceMethod(
        bcrypt,
        "compare",
        async function () {
            return false;
        }
    );

    try {
        const req = {
            body: {
                email: "test@example.com",
                password: "wrong-password"
            }
        };

        const res = createResponse();

        await loginUser(req, res);

        assert.equal(res.statusCode, 401);
    } finally {
        restoreFind();
        restoreCompare();
    }
});

test("Get profile should return the user's profile", async function () {
    const restore = replaceMethod(
        User,
        "findById",
        async function () {
            return {
                _id: "user123",
                username: "Test User",
                email: "test@example.com",
                role: "admin"
            };
        }
    );

    try {
        const req = {
            user: { userId: "user123" }
        };

        const res = createResponse();

        await getUserProfile(req, res);

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.user.username, "Test User");
        assert.equal(res.body.user.role, "admin");
    } finally {
        restore();
    }
});

test("Change password should reject a short new password", async function () {
    const req = {
        user: { userId: "user123" },
        body: {
            currentPassword: "oldpassword",
            newPassword: "123"
        }
    };

    const res = createResponse();

    await changePassword(req, res);

    assert.equal(res.statusCode, 400);
});

test("Forgot password should return the same message for an unknown email", async function () {
    const restore = replaceMethod(
        User,
        "findOne",
        async function () {
            return null;
        }
    );

    try {
        const req = {
            body: { email: "unknown@example.com" }
        };

        const res = createResponse();

        await forgotPassword(req, res);

        assert.equal(res.statusCode, 200);
        assert.match(res.body.message, /If the account exists/i);
    } finally {
        restore();
    }
});

test("Reset password should reject missing fields", async function () {
    const req = { body: {} };
    const res = createResponse();

    await resetPassword(req, res);

    assert.equal(res.statusCode, 400);
});

test("Reset password should reject a short new password", async function () {
    const req = {
        body: {
            token: "test-token",
            newPassword: "123"
        }
    };

    const res = createResponse();

    await resetPassword(req, res);

    assert.equal(res.statusCode, 400);
});
