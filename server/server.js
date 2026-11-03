const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");

const studentRoutes = require("./routes/StudentRoutes");
const authRoutes = require("./routes/AuthRoutes");
const userRoutes = require("./routes/UserRoutes");
const courseRoutes = require("./routes/CourseRoutes");
const instructorRoutes = require("./routes/InstructorRoutes");
const reportRoutes = require("./routes/ReportRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

// Configure CORS
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options(/.*/, cors());

app.use(express.json());

// Home route
app.get("/", function (req, res) {
    res.send("Student Management System API is running!");
});

// Student routes
app.use("/api/students", studentRoutes);

// Authentication routes
app.use("/api/auth", authRoutes);

// User management routes
app.use("/api/users", userRoutes);

// Course management routes
app.use("/api/courses", courseRoutes);

// Instructor management routes
app.use("/api/instructors", instructorRoutes);

// Admin reports
app.use("/api/reports", reportRoutes);

// Centralized error-handling middleware
app.use(errorHandler);

// Start the server after connecting to MongoDB
async function startServer() {
    await connectDB();

    app.listen(5000, function () {
        console.log("Server is running on port number 5000");
    });
}

startServer();