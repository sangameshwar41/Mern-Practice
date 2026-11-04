
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

    // File upload errors from Multer
    if (err.name === "MulterError") {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // File type validation errors from our upload middleware
    if (err.message === "Only JPG, PNG and WebP photos are allowed.") {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    if (err.message === "Only PDF documents are allowed.") {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Unexpected server error
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.statusCode ? err.message : "Internal Server Error"
    });
}

module.exports = errorHandler;
