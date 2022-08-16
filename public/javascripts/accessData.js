// Author: Matthew Groh
// Last Updated: 8/12/2022
//
// accessData.js
//
// This script loads the full table from the SQL database and displays it on
// both the main and individual pages

const loadTable = async (queryString, pageNum) => {
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
			loadPage(data, pageNum);
		}
	}).fail(function(jqxhr, settings, ex) {
		console.log("Could not access table");
	});
};

function loadPage(data, pageNum){
	// Call different population function depending on what page
	// user is currently on
	// NOT THE BEST WAY TO DO THIS
	// TRY TO IMPROVE AT SOME POINT
	if(window.location.href.indexOf("individual_page") > -1) {
		var carID = location.search.substring(1);
		populateIndividual(data, carID);
	} else {
		populateMain(data, pageNum);
	}
}

function populateMain(data, pageNum){
	var currentRow, newDiv, newLink, newImg, newP;
	var resultsCounter = document.getElementById("resultsCounter");
	
	// Number of rows and columns to display per page
	var numRows = 10;
	var numCols = 10;
	var carsPerPage = numRows * numCols;

	for(var i = 0; i < numRows; i++){
		// Create new "div" element for a new row
		currentRow = document.createElement("div");
		currentRow.setAttribute("id", "row" + i);
		currentRow.setAttribute("class", "row");

		// Calculate starting and ending indices based on 
		// number of cars per page and current page
		var startingID = i * numCols + (pageNum * carsPerPage);
		var endingID = (i + 1) * numCols + (pageNum * carsPerPage);

		// Populate row with correct number of columns
		for(var j = startingID; j < endingID; j++){
			newDiv = document.createElement("div");
			newDiv.setAttribute("class", "column");

			// Only add links, images, and text if end of
			// data has not been reached
			if(j < data.length){
				newLink = document.createElement("a");
				newImg = document.createElement("img");
				newP = document.createElement("p");

				newLink.href = "individual_page.html?" + data[j].id;
				newImg.setAttribute("id", "image" + data[j].id);
				newP.setAttribute("id", "result" + data[j].id);

				newLink.appendChild(newImg);
				newLink.appendChild(newP);
				newDiv.appendChild(newLink);
			}
			currentRow.appendChild(newDiv);
		}

		// Append row to index.html such that page selection always
		// remains on bottom of page
		if(i == 0){
			resultsCounter.insertAdjacentElement("afterend", currentRow);
		} else {
			var prevRow = document.getElementById("row" + (i - 1))
			prevRow.insertAdjacentElement("afterend", currentRow);
		}
	}

	// Update text to display info about results on current page
	var startingNum = Math.min(data.length, ((carsPerPage * parseInt(pageNum)) + 1));
	var endingNum = Math.min(data.length, carsPerPage * (parseInt(pageNum) + 1));
	resultsCounter.innerHTML = "Displaying " + startingNum + " - "
		+ endingNum + " of " + data.length + " results";

	// Add table data into newly created rows
	var index = pageNum * carsPerPage;
	var counter = 0;
	for(var k = index; k < data.length; k++){
		// Break loop if max number of cars on page is reached
		if(counter == carsPerPage){
			break;
		}
		document.getElementById("result" + data[k].id).innerHTML = data[k].number + " - " + data[k].driver;
		document.getElementById("image" + data[k].id).src = data[k].imageCar;
		counter++;
	}

	// Hide unnecessary page select options
	var pageSelect = document.getElementById("pageSelect");
	for(var m = 19; m >= data.length / carsPerPage; m--){
		pageSelect[m].hidden = true;
	}

	// Correct the starting page select value
	pageSelect.value = pageNum;
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

function clearPage() {
	// NOT GREAT
	// IMPROVE LATER

	// Unhide all page select options
	var pageSelect = document.getElementById("pageSelect");
	for(var i = 0; i < 20; i++){
		pageSelect[i].hidden = false;
	}

	// Delete all previous dynamic HTML
	for(var j = 200; j > -1; j--){
		var thisRow = document.getElementById("row" + j);
		if(thisRow){
			thisRow.remove();
		}
	}
}

function searchCar() {
	queryString = "SELECT * FROM carInfo ";
	var searchDriver = document.getElementById("searchDriver").value;
	var searchNumber = document.getElementById("searchNumber").value;
	var searchSeries = document.getElementById("searchSeries").value;
	var searchSponsor = document.getElementById("searchSponsor").value;
	var searchManufacturer = document.getElementById("searchManufacturer").value;
	var searchYear = document.getElementById("searchYear").value;

	// Create single SQL query based on inputted info
	// FEEL LIKE THERE'S A BETTER WAY TO DO THIS
	// MAYBE TRY TO IMPROVE LATER
	if(searchDriver){
		if(queryString.length <= 22){
			queryString += " WHERE ";
		} else {
			queryString += " AND ";
		}
		queryString += 'driver LIKE "%' + searchDriver + '%" ';
	}
	if(searchNumber){
		if(queryString.length <= 22){
			queryString += " WHERE ";
		} else {
			queryString += " AND ";
		}
		queryString += '"' + searchNumber + '" IN (number) ';
	}
	if(searchSeries){
		if(queryString.length <= 22){
			queryString += " WHERE ";
		} else {
			queryString += " AND ";
		}
		queryString += ' series LIKE "%' + searchSeries + '%" ';
	}
	if(searchSponsor){
		if(queryString.length <= 22){
			queryString += " WHERE ";
		} else {
			queryString += " AND ";
		}
		queryString += 'sponsor LIKE "%' + searchSponsor + '%" ';
	}
	if(searchManufacturer){
		if(queryString.length <= 22){
			queryString += " WHERE ";
		} else {
			queryString += " AND ";
		}
		queryString += 'manufacturer LIKE "%' + searchManufacturer + '%" ';
	}
	if(searchYear){
		if(queryString.length <= 22){
			queryString += " WHERE ";
		} else {
			queryString += " AND ";
		}
		queryString += '"' + searchYear + '" IN (year) ';
	}

	// Reload table based on search term(s)
	clearPage();
	loadTable(queryString, 0);
}

// CHECK IF SQL INJECTION IS POSSIBLE DUE TO THIS
var queryString = "SELECT * FROM carInfo ";

$(document).ready(function() {
	// Load all table entries when first loading page
	loadTable(queryString, 0);

	if(window.location.href.indexOf("individual_page") == -1) {
		var searchBars = document.getElementById("searchBars");
		var clearButton = document.getElementById("clearButton");
		var submitButton = document.getElementById("submitButton");
		var pageSelect = document.getElementById("pageSelect");

		// Perform search function if either "Submit" button is clicked
		// or Enter key ius pressed in any box
		searchBars.addEventListener("keypress", function(event) {
			if(event.key === "Enter") {
				searchCar();
			}
		});
		submitButton.addEventListener("click", function() {
			searchCar();
		});


		// Clear all search inputs
		clearButton.addEventListener("click", function() {
			document.getElementById("searchDriver").value = "";
			document.getElementById("searchNumber").value = "";
			document.getElementById("searchSeries").value = "";
			document.getElementById("searchSponsor").value = "";
			document.getElementById("searchManufacturer").value = "";
			document.getElementById("searchYear").value = "";
		});

		// Reload page for corresponding selection
		pageSelect.addEventListener("change", function() {
			clearPage();
			loadTable(queryString, pageSelect.value);
		});
	}
});
