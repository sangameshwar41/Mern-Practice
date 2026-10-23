const express = require("express");
require("dotenv").config();

const connectDB = require("./db");
const Student = require("./models/Student");

const app = express();
app.use(express.json());

app.get("/", function (req, res) {
    res.send("Student Management System API is running!");
});
app.post("/students", async function (req, res) {
    try {
        const student = await Student.create(req.body);

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
app.get("/students", async function (req, res) {
    try {
        const students = await Student.find();

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
async function startServer() {
    await connectDB();

    app.listen(5000, function () {
        console.log("Server is running on port number 5000");
    });
}

startServer();