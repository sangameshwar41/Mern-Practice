const express = require("express");
const cors = require("cors");

const studentRoutes = require("./routes/StudentRoutes");
const authRoutes = require("./routes/AuthRoutes");
const userRoutes = require("./routes/UserRoutes");
const courseRoutes = require("./routes/CourseRoutes");
const instructorRoutes = require("./routes/InstructorRoutes");
const reportRoutes = require("./routes/ReportRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options(/.*/, cors());

app.use(express.json());

app.get("/", function (req, res) {
    res.send("Student Management System API is running!");
});

app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/reports", reportRoutes);

app.use(errorHandler);

module.exports = app;
