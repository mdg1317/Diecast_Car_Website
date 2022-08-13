// Author: Matthew Groh
// Last Updated: 8/12/2022
//
// tableData.js
//
// This route gets the table data from the database to be used
// on the webpages

// Necessary requires
var express = require("express");
var router = express.Router();
var server = require("./dbms.js");

// Request the table data
router.post("/", function(req, res, next) {
	console.log("Accessing table from SQL server");
	server.dbquery("SELECT * FROM carInfo;", receiveData);

	// Helper function to process the data from the query
	function receiveData(err, results) {
		console.log("Received table from SQL server");
		console.log(results);
		res.json(results);
		console.log("Finished POST request");
	}
});

module.exports = router;