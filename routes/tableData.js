var express = require("express");
var router = express.Router();
var server = require("./dbms.js");

const app = express();

var table = [];

router.post("/", function(req, res, next) {
	console.log("Accessing table from SQL server");
	server.dbquery("SELECT * FROM carInfo", receiveData);

	function receiveData(err, results) {
		console.log("Received table from SQL server");
		table = results;
		res.json(table);
		console.log("Finished POST request");
	}
});

module.exports = router;