
const Joi = require("joi");

const courseSchema = Joi.object({

    courseName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    courseCode: Joi.string()
        .trim()
        .uppercase()
        .min(2)
        .max(20)
        .required(),

    description: Joi.string()
        .trim()
        .max(500)
        .allow(""),

    duration: Joi.string()
        .trim()
        .required(),

    fee: Joi.number()
        .min(0)
        .required(),

    status: Joi.string()
        .valid("active", "inactive"),

    instructor: Joi.string()
        .hex()
        .length(24)
        .allow(null, "")

}).unknown(false);

const courseUpdateSchema = courseSchema
    .fork(
        [
            "courseName",
            "courseCode",
            "description",
            "duration",
            "fee",
            "status",
            "instructor"
        ],
        function (field) {
            return field.optional();
        }
    )
    .min(1)
    .unknown(false);

module.exports = {
    courseSchema,
    courseUpdateSchema
};
