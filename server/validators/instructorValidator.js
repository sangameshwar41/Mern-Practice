const Joi = require("joi");

const instructorSchema = Joi.object({

    instructorName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required(),

    specialization: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    experience: Joi.number()
        .min(0)
        .required()
});

const instructorUpdateSchema = instructorSchema
    .fork(
        [
            "instructorName",
            "email",
            "specialization",
            "experience"
        ],
        function (field) {
            return field.optional();
        }
    )
    .min(1);

module.exports = {
    instructorSchema,
    instructorUpdateSchema
};