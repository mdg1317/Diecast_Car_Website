// Route used to get data from SQL database and store as JSON
// Presumably exists since it can't be done in app.js?
var express = require("express");
var router = express.Router();
var server = require("./dbms.js");

//var tableJSON;

router.post("/", function(req, res, next) {
	console.log("Accessing table from SQL server");
	server.dbquery("SELECT * FROM carInfo;", receiveData);

	function receiveData(err, results) {
		console.log("Received table from SQL server");
		console.log(results);
		//tableJSON = JSON.stringify(results);
		//res.send(tableJSON);
		res.json(results);
		console.log("Finished POST request");
	}
});

module.exports = router;