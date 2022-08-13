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
		var carID = location.search.substring(1);
		populateIndividual(data, carID);
	} else {
		populateMain(data);
	}
}

function populateMain(data){
	var i;
	for(i = 0; i < 10; i++){
		document.getElementById("result" + i).innerHTML = data[i].number + " - " + data[i].driver;
		document.getElementById("image" + i).src = data[i].imageCar;
	}
}

function populateIndividual(data, carID){
	document.getElementById("header").innerHTML = data[carID].number + " - " + data[carID].driver;
	document.getElementById("driver").innerHTML = data[carID].driver;
	document.getElementById("number").innerHTML = data[carID].number;
	document.getElementById("series").innerHTML = data[carID].series;
	document.getElementById("sponsor").innerHTML = data[carID].sponsor;
	document.getElementById("manufacturer").innerHTML = data[carID].manufacturer;
	document.getElementById("year").innerHTML = data[carID].year;
	document.getElementById("image0").src = data[carID].image0;
	document.getElementById("image1").src = data[carID].image1;
	document.getElementById("imageCar").src = data[carID].imageCar;
	document.getElementById("imageDriver").src = data[carID].imageDriver;
}

loadTable();