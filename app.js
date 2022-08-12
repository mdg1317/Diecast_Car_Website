var express = require("express");
var path = require("path");
var app = express();

var indexRouter = require("./routes/index.js")
var tableRouter = require("./routes/tableData");

app.use("/", indexRouter);
app.use("/tableData", tableRouter);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.listen(5000, () => {
	console.log("Application started and listening on port 5000");
});

module.exports = app;