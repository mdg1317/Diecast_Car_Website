const loadTable = async () => {
	console.log("Attempting to access table...");
	$.post({
		url: "/tableData",
		success: function(data, ) {
			console.log("Successfully accessed table");
			console.log(data);
			loadPage(data);
		}
	}).fail(function(jqxhr, settings, ex) {
		console.log("Could not access table");
	});
};

function loadPage(data){
	// NOT THE BEST WAY TO DO THIS
	// TRY TO IMPROVE AT SOME POINT
	if(window.location.href.indexOf("individual_page") > -1) {
		document.getElementById("header").innerHTML = data[0].number + " - " + data[0].driver;
		document.getElementById("driver").innerHTML = data[0].driver;
		document.getElementById("number").innerHTML = data[0].number;
		document.getElementById("series").innerHTML = data[0].series;
		document.getElementById("sponsor").innerHTML = data[0].sponsor;
		document.getElementById("manufacturer").innerHTML = data[0].manufacturer;
		document.getElementById("year").innerHTML = data[0].year;
	} else {
		document.getElementById("result0").innerHTML = data[0].number + " - " + data[0].driver;
		document.getElementById("result1").innerHTML = data[1].number + " - " + data[1].driver;
		document.getElementById("result2").innerHTML = data[2].number + " - " + data[2].driver;
	}
}

loadTable();