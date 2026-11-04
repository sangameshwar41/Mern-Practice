const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const photoFolder = path.join(
    __dirname,
    "../uploads/students/photos"
);

const documentFolder = path.join(
    __dirname,
    "../uploads/students/documents"
);

// Make sure the storage folders exist
fs.mkdirSync(photoFolder, { recursive: true });
fs.mkdirSync(documentFolder, { recursive: true });

// Generate safe, unique filenames
function createSafeFilename(originalName) {
    const extension = path.extname(originalName).toLowerCase();
    return `${crypto.randomUUID()}${extension}`;
}

// Store files on the local computer
const photoStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, photoFolder);
    },

    filename: function (req, file, callback) {
        callback(null, createSafeFilename(file.originalname));
    }
});

const documentStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, documentFolder);
    },

    filename: function (req, file, callback) {
        callback(null, createSafeFilename(file.originalname));
    }
});

// Check both file extension and MIME type
function isAllowedFile(file, allowedExtensions, allowedMimeTypes) {
    const extension = path.extname(file.originalname).toLowerCase();

    return (
        allowedExtensions.includes(extension) &&
        allowedMimeTypes.includes(file.mimetype)
    );
}

function photoFileFilter(req, file, callback) {
    const allowed = isAllowedFile(
        file,
        [".jpg", ".jpeg", ".png", ".webp"],
        ["image/jpeg", "image/png", "image/webp"]
    );

    if (allowed) {
        return callback(null, true);
    }

    callback(new Error("Only JPG, PNG and WebP photos are allowed."));
}

function documentFileFilter(req, file, callback) {
    const allowed = isAllowedFile(
        file,
        [".pdf"],
        ["application/pdf"]
    );

    if (allowed) {
        return callback(null, true);
    }

    callback(new Error("Only PDF documents are allowed."));
}

// Photo upload: maximum 2 MB, one file
const uploadPhoto = multer({
    storage: photoStorage,
    fileFilter: photoFileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024,
        files: 1
    }
});

// Document upload: maximum 5 MB, one file
const uploadDocument = multer({
    storage: documentStorage,
    fileFilter: documentFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
    }
});

module.exports = {
    uploadPhoto,
    uploadDocument
};