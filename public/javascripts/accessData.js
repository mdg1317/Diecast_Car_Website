const loadTable = async () => {
	console.log("Attempting to access table...");
	$.post({
		url: "/tableData",
		success: function(data, ) {
			console.log("Successfully accessed table");
			console.log(data);
		}
	}).fail(function(jqxhr, settings, ex) {
		console.log("Could not access table");
	});
};

$(document).ready(function() {
	loadTable();
	//document.getElementById("result0").innerHTML = "NOT Brett Bodine";
});