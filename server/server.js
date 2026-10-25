const express = require("express");
require("dotenv").config();

const connectDB = require("./db");
const studentRoutes = require("./routes/StudentRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

// Home route
app.get("/", function (req, res) {
    res.send("Student Management System API is running!");
});

// Student routes
app.use("/api/students", studentRoutes);

// Centralized error-handling middleware
app.use(errorHandler);

async function startServer() {
    await connectDB();

    app.listen(5000, function () {
        console.log("Server is running on port number 5000");
    });
}

startServer();