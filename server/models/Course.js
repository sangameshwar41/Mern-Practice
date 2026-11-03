const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
            required: true,
            trim: true
        },

        courseCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        duration: {
            type: String,
            required: true,
            trim: true
        },
        
        fee: {
           type: Number,
           required: true,
           min: 0
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        },

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Instructor",
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Course", courseSchema);