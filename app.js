var express = require("express");
var path = require("path");
var app = express();

var tableRouter = require("./routes/tableData");

app.use("/tableData", tableRouter);

app.listen(5000, () => {
	console.log("Application started and listening on port 5000");
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});