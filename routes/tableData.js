// Author: Matthew Groh
// Last Updated: 8/12/2022
//
// tableData.js
//
// This route gets the table data from the database to be used
// on the webpages

// Necessary requires
var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var server = require("./dbms.js");

var jsonParser = bodyParser.json();

// Request the table data
router.post("/", jsonParser, function(req, res, next) {
	console.log("Accessing table from SQL server");
	console.log(req.body.searchString);
	server.dbquery(req.body.searchString, receiveData);

	// Helper function to process the data from the query
	function receiveData(err, results) {
		console.log("Received table from SQL server");
		console.log(results);
		res.json(results);
		console.log("Finished POST request");
	}
});

module.exports = router;