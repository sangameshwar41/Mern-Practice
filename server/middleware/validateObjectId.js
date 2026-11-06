function validateObjectId(paramName = "id") {

    return function (req, res, next) {

        const id = req.params[paramName];

        const objectIdPattern = /^[0-9a-fA-F]{24}$/;

        if (!objectIdPattern.test(id)) {
            return res.status(400).json({
                message: "Invalid MongoDB ID"
            });
        }

        next();
    };
}

module.exports = validateObjectId;