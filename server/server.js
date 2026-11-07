require("dotenv").config();

const app = require("./app");
const connectDB = require("./db");

async function startServer() {
    await connectDB();

    app.listen(5000, function () {
        console.log("Server is running on port number 5000");
    });
}

startServer();