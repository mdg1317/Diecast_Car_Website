// Author: Matthew Groh
// Last Updated: 8/12/2022
//
// dbms.js
//
// This route attempts to establish connection with the SQL database
// based on the provided credentials

// Necessary requires
var mysql = require("mysql");
var async = require("async");

// Database credentials
var host = "db-car-info.cbloksucnd0c.us-west-2.rds.amazonaws.com";
var user = "mdg1317";
var password = "Offroader$9!!!!";
var database = "diecastCarInfo";


// Perform given SQL query and return results
exports.dbquery = function(query_str, callback) {
	var dbclient;

	async.waterfall([
		// Connect to the database
		function(callback) {
			console.log("Creating connection...\n");
			dbclient = mysql.createConnection({
				host: host,
				user: user,
				password: password,
				database: database
			});
			dbclient.connect(callback);
		},

		// Issue the query
		function(results, callback) {
			console.log("Retreiving data...\n");
			dbclient.query(query_str, callback);
		},

		// Get the results from previous query
		function(rows, results, callback) {
			console.log("Dumping data...\n");
			results = rows;
			callback(null, results);
		}
	],
	
	// Cleanup function for waterfall
	function(err, results) {
		if(err){
			console.log("Database query failed");
			console.log(err);
			callback(err, null);
		} else {
			console.log("Database query completed");
			callback(false, results);
		}
		dbclient.end();
	});
}