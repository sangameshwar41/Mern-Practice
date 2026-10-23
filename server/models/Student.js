const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        mobileNumber: {
            type: String,
            required: true
        },

        gender: {
            type: String,
            required: true
        },

        course: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// model creation
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;