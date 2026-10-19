const express = require("express");

const app = express();

app.get("/", function (req, res) {
    res.send("Student Management System API is running!");
});
app.listen(5000,function(){
    console.log("server is running on port number 5000");
    
})