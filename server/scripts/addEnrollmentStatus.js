require("dotenv").config();

const mongoose = require("mongoose");
const Student = require("../models/Student");

async function addEnrollmentStatus() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully");

        const result = await Student.updateMany(
            {
                enrollmentStatus: { $exists: false }
            },
            {
                $set: {
                    enrollmentStatus: "enrolled"
                }
            }
        );

        console.log("Existing student records updated:", result.modifiedCount);

    } catch (error) {
        console.error("Migration failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

addEnrollmentStatus();