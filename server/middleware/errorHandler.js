
function errorHandler(err, req, res, next) {
    console.error(err.message);

    // Duplicate email error
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "A student with this email already exists"
        });
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Unexpected server error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.statusCode ? err.message : "Internal Server Error"
    });
}

module.exports = errorHandler;
