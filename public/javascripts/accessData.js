// Author: Matthew Groh
// Last Updated: 8/12/2022
//
// accessData.js
//
// This script loads the full table from the SQL database and displays it on
// both the main and individual pages

const loadTable = async () => {
	console.log("Attempting to access table...");

	// Send a POST request invoking "/tableData" route found in app.js
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
	// Call different population function depending on what page
	// user is currently on
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
	var i,j;
	var currentRow;
	for(i = 0; i < data.length / 5; i++){
		// Create new "div" element for a new row
		currentRow = document.createElement("div");
		currentRow.setAttribute("id", "row" + i);
		currentRow.setAttribute("class", "row");

		// Create 5 columns in each row
		for(j = i * 5; j < (i + 1) * 5; j++){
			var newDiv = document.createElement("div");
			var newLink = document.createElement("a");
			var newImg = document.createElement("img");
			var newP = document.createElement("p");

			newDiv.setAttribute("class", "column");
			newLink.href = "individual_page.html?" + j;

			newImg.setAttribute("id", "image" + j);
			newImg.src = data[j].imageCar;
			newImg.setAttribute("alt", "No image available");

			newP.setAttribute("id", "result" + j);
			newP.innerHTML = data[j].number + " - " + data[j].driver;

			newLink.appendChild(newImg);
			newLink.appendChild(newP);
			newDiv.appendChild(newLink);
			currentRow.appendChild(newDiv);
		}

		// Append row to index.html
		document.body.appendChild(currentRow);
	}

}

function populateIndividual(data, carID){
	// Replace all sample data with data from SQL query
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

// This function is called upon page load
loadTable();