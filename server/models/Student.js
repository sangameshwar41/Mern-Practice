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

// Indexes for student listing
studentSchema.index({ fullName: 1 });
studentSchema.index({ course: 1 });
studentSchema.index({ gender: 1 });
studentSchema.index({ createdAt: -1 });

// Create the Student model
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;