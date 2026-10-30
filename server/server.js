const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");
const studentRoutes = require("./routes/StudentRoutes");
const authRoutes = require("./routes/AuthRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"]
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

// Centralized error-handling middleware
app.use(errorHandler);

async function startServer() {
    await connectDB();

    app.listen(5000, function () {
        console.log("Server is running on port number 5000");
    });
}

startServer();