const test = require("node:test");
const assert = require("node:assert");

const enrollmentEmail = require("../templates/enrollmentEmail");

test("Email template should contain student name and course name", function () {

    const html = enrollmentEmail(
        "Sangameshwar",
        "MERN Stack Development"
    );

    assert.ok(html.includes("Sangameshwar"));
    assert.ok(html.includes("MERN Stack Development"));

});
const sendEmail = require("../services/emailService");

test("Email service should send email successfully", async function () {

    const fakeTransporter = {
        sendMail: async function (mailOptions) {
            return {
                messageId: "test-email-123",
                accepted: [mailOptions.to]
            };
        }
    };

    const emailService = sendEmail.createEmailService(fakeTransporter);

    const result = await emailService({
        to: "student@example.com",
        subject: "Enrollment Confirmation"
    });

    assert.strictEqual(result.messageId, "test-email-123");

});
test("Email service should handle email sending failure", async function () {

    const fakeTransporter = {
        sendMail: async function () {
            throw new Error("SMTP connection failed");
        }
    };

    const emailService = sendEmail.createEmailService(fakeTransporter);

    await assert.rejects(
        emailService({
            to: "student@example.com",
            subject: "Enrollment Confirmation"
        }),
        {
            message: "SMTP connection failed"
        }
    );

});