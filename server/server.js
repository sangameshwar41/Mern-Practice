
require("dotenv").config();

const app = require("./app");
const connectDB = require("./db");

async function startServer() {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, function () {
            console.log(`Server is running on port number ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();
