
function errorHandler(err, req, res, next) {

    // Avoid logging sensitive error details.
    console.error("Request error:", err.name || "UnknownError");

    if (res.headersSent) {
        return next(err);
    }

    // Duplicate database record
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "A record with this information already exists"
        });
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Invalid input data"
        });
    }

    // File upload errors
    if (err.name === "MulterError") {
        return res.status(400).json({
            success: false,
            message: "File upload failed. Check the file type and size."
        });
    }

    // Custom file type validation errors
    if (
        err.message === "Only JPG, PNG and WebP photos are allowed." ||
        err.message === "Only PDF documents are allowed."
    ) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Unexpected server error
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
}

module.exports = errorHandler;
