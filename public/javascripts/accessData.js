// Author: Matthew Groh
// Last Updated: 8/12/2022
//
// accessData.js
//
// This script loads the full table from the SQL database and displays it on
// both the main and individual pages

const loadTable = async (queryString) => {
	console.log("Attempting to access table...");
	// Send a POST request invoking "/tableData" route found in app.js containing
	// the proper SQL query depending on initial load/search term(s)
	$.post({
		traditional: true,
		url: "/tableData",
		data: JSON.stringify({searchString: queryString}),
		dataType: "json",
		contentType: "application/json; charset=utf-8",
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
	var i,j,k;
	var currentRow;
	var pageID;
	//console.log(data[0].id);
	for(i = 0; i < data.length / 5; i++){
		// Create new "div" element for a new row
		currentRow = document.createElement("div");
		currentRow.setAttribute("id", "row" + i);
		currentRow.setAttribute("class", "row");

		// Populate row with 5 columns
		for(j = i * 5; j < (i + 1) * 5; j++){
			if(j < data.length){
				pageID = data[j].id;
			} else {
				pageID = -1;
			}
			var newDiv = document.createElement("div");
			var newLink = document.createElement("a");
			var newImg = document.createElement("img");
			var newP = document.createElement("p");

			newDiv.setAttribute("class", "column");
			newLink.href = "individual_page.html?" + pageID;

			//console.log(data[carIndex].id);

			newImg.setAttribute("id", "image" + pageID);
			//newImg.setAttribute("alt", "No image available");

			newP.setAttribute("id", "result" + pageID);

			newLink.appendChild(newImg);
			newLink.appendChild(newP);
			newDiv.appendChild(newLink);
			currentRow.appendChild(newDiv);
		}

		// Append row to index.html
		document.body.appendChild(currentRow);
	}
	// Add table data into newly created rows
	for(k = 0; k < data.length; k++){
		document.getElementById("result" + data[k].id).innerHTML = data[k].number + " - " + data[k].driver;
		document.getElementById("image" + data[k].id).src = data[k].imageCar;
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

function clearTable() {
	// Delete all previously created rows
	// NOT GREAT
	// IMPROVE LATER
	var i;
	for(i = 200; i > -1; i--){
		var thisRow = document.getElementById("row" + i);
		if(thisRow){
			thisRow.remove();
		}
	}
}

function searchCar() {
	var queryString;
	var searchString = document.getElementById("searchBar").value;

	// If "Submit" is hit when search bar is empty, load all table entries
	if(!searchString){
		queryString = "SELECT * FROM carInfo";
	} else {
		// NOTE: THIS QUERY ONLY SUPPORTS ONE TYPE OF FIELD
		// ADD MULTIPLE FIELDS FUNCTIONALITY LATER
		queryString = 'SELECT * FROM carInfo WHERE \
			driver LIKE "%' + searchString + '%" OR \
			"' + searchString + '" IN (number) OR \
			series LIKE "%' + searchString + '%" OR \
			sponsor LIKE "%' + searchString + '%" OR \
			"' + searchString + '" IN (manufacturer) OR \
			"' + searchString + '" IN (year)';
	}

	// Reload table based on search term(s)
	clearTable();
	loadTable(queryString);
}

$(document).ready(function() {
	// Load all table entries when first loading page
	loadTable("SELECT * FROM carInfo");

	if(window.location.href.indexOf("individual_page") == -1) {
		var searchField = document.getElementById("searchBar");
		var submitButton = document.getElementById("submitButton");

		searchField.addEventListener("keypress", function(event) {
			if(event.key === "Enter") {
				searchCar();
			}
		});
		submitButton.addEventListener("click", function() {
			searchCar();
		});
	}
});
