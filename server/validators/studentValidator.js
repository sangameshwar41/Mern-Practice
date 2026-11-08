
const Joi = require("joi");

const studentSchema = Joi.object({
    fullName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required(),

    mobileNumber: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),

    gender: Joi.string()
        .valid("male", "female", "other")
        .required(),

    course: Joi.string()
        .hex()
        .length(24)
        .required(),

    address: Joi.string()
        .trim()
        .min(5)
        .max(200)
        .required(),

    enrollmentStatus: Joi.string()
        .valid("enrolled", "completed", "cancelled")
})
    .unknown(false);

const studentUpdateSchema = studentSchema
    .fork(
        [
            "fullName",
            "email",
            "mobileNumber",
            "gender",
            "course",
            "address",
            "enrollmentStatus"
        ],
        function (field) {
            return field.optional();
        }
    )
    .min(1)
    .unknown(false);

module.exports = {
    studentSchema,
    studentUpdateSchema
};
