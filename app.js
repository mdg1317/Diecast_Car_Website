// Author: Matthew Groh
// Last Updated: 8/12/2022
//
// app.js
//
// This script starts the server and handles all routes

// Necessary requires
var express = require("express");
var path = require("path");
var app = express();

// Import routes
var indexRouter = require("./routes/index.js")
var tableRouter = require("./routes/tableData");

// Set up routes
app.use("/", indexRouter);
app.use("/tableData", tableRouter);

// Use all files in public directory for web display
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Start listening on port 5000
app.listen(5000, () => {
	console.log("Application started and listening on port 5000");
});

module.exports = app;