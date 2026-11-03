const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema(
    {
        instructorName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        specialization: {
            type: String,
            required: true,
            trim: true
        },

        experience: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Instructor", instructorSchema);