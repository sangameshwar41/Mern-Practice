
function validate(schema) {
    return function (req, res, next) {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: false
        });

        if (error) {
            const errors = error.details.map(function (detail) {
                return detail.message;
            });

            return res.status(400).json({
                message: "Validation failed",
                errors: errors
            });
        }

        req.body = value;
        next();
    };
}

module.exports = validate;
