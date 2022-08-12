let table = [];

const loadTable = async () => {
	console.log("Attempting to access table...");
	$.post({
		url: "/tableData",
		success: function(data, ) {
			console.log("Successfully accessed table");
			console.log(data);
			//storeTable(data);
			loadPage(data);
		}
	}).fail(function(jqxhr, settings, ex) {
		console.log("Could not access table");
	});
};

function loadPage(data){
	document.getElementById("result0").innerHTML = data[0].number + " - " + data[0].driver;
	document.getElementById("result1").innerHTML = data[1].number + " - " + data[1].driver;
	document.getElementById("result2").innerHTML = data[2].number + " - " + data[2].driver;
}

/*function storeTable(data){
	//table = data;
	console.log(data[0].id);
	var i;
	for(i = 0; i < data.length; i++){
		var myId = data[i].id;
		var myDriver = data[i].driver;
		var myNumber = data[i].number;
		var mySeries = data[i].series;
		var mySponsor = data[i].sponsor;
		var myManufacturer = data[i].manufacturer;
		var myYear = data[i].year;
		var myImage = data[i].image;
		var carJSON = {
			id: myId,
			driver: myDriver,
			number: myNumber,
			series: mySeries,
			sponsor: mySponsor,
			manufacturer: myManufacturer,
			year: myYear,
			image: myImage
		}
		table[i] = carJSON;
	}
}*/

$(document).ready(function() {
	loadTable();
	//console.log(table);
	//document.getElementById("result0").innerHTML = table;
});