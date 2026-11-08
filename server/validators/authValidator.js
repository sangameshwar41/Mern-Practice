
const Joi = require("joi");

const registerSchema = Joi.object({
    username: Joi.string()
        .trim()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required(),

    password: Joi.string()
        .min(8)
        .max(100)
        .required()
}).unknown(false);

const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required(),

    password: Joi.string()
        .required()
}).unknown(false);

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required(),

    newPassword: Joi.string()
        .min(8)
        .max(100)
        .required()
}).unknown(false);

const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required()
}).unknown(false);

const resetPasswordSchema = Joi.object({
    token: Joi.string()
        .required(),

    newPassword: Joi.string()
        .min(8)
        .max(100)
        .required()
}).unknown(false);

module.exports = {
    registerSchema,
    loginSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    resetPasswordSchema
};
