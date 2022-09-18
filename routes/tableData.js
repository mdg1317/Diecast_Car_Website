// Author: Matthew Groh
// Last Updated: 8/16/2022
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
router.post("/", function(req, res, next) {
	console.log("Accessing table from SQL server");
	server.dbquery("SELECT * FROM carInfo ORDER BY year, \
		series='None', series='ARCA', series='Truck', series='Xfinity', series='Cup', \
		SUBSTRING_INDEX(SUBSTRING_INDEX(driver, ' ', 2), ' ', -1), id", receiveData);

	// Helper function to process the data from the query
	function receiveData(err, results) {
		console.log("Received table from SQL server");
		res.json(results);
		console.log("Finished POST request");
	}
});

module.exports = router;

// Number -> Series -> Year (Physical collection order)
//server.dbquery("SELECT * FROM carInfo ORDER BY number + 0, \
	//series='None', series='ARCA', series='Truck', series='Xfinity', series='Cup', \
	//year", receiveData);

// Year -> Series -> Last Name
//server.dbquery("SELECT * FROM carInfo ORDER BY year, \
	//series='None', series='ARCA', series='Truck', series='Xfinity', series='Cup', \
	//SUBSTRING_INDEX(SUBSTRING_INDEX(driver, ' ', 2), ' ', -1)", receiveData);