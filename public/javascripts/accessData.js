const loadTable = async () => {
	console.log("Attempting to access table...");
	$.post({
		url: "/tableData",
		success: function(data, ) {
			console.log("Successfully accessed table");
		}
	}).fail(function() {
		console.log("Could not access table");
	});
};

$(document).ready(function() {
	loadTable();
});