var mysql = require("mysql");
var async = require("async");

var host = "db-car-info.cbloksucnd0c.us-west-2.rds.amazonaws.com";
var user = "mdg1317";
var password = "Offroader$9!!!!";
var database = "diecastCarInfo";

exports.dbquery = function(query_str, callback) {
	var dbclient;

	async.waterfall([
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

		function(results, callback) {
			console.log("Retreiving data...\n");
			dbclient.query(query_str, callback);
		},

		function(rows, results, callback) {
			console.log("Dumping data...\n");
			results = rows;
			console.log(results);
			callback(null);
		}
	],
	
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