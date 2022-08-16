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
		populateMain(data, 0);
	}
}

function populateMain(data, pageNum){
	var i,j,k,m;
	var currentRow, newDiv, newLink, newImg, newP;
	
	// Number of rows and columns to display per page
	var numRows = 3;
	var numCols = 5;
	var carsPerPage = numRows * numCols;

	for(i = 0; i < numRows; i++){
		// Create new "div" element for a new row
		currentRow = document.createElement("div");
		currentRow.setAttribute("id", "row" + i);
		currentRow.setAttribute("class", "row");

		// Populate row with 5 columns
		for(j = i * numCols; j < (i + 1) * numCols; j++){
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

		// Append row to index.html such that pagination always
		// remains on bottom of page
		if(i == 0){
			var searchBars = document.getElementById("searchBars");
			searchBars.insertAdjacentElement("afterend", currentRow);
		} else {
			var prevRow = document.getElementById("row" + (i - 1))
			prevRow.insertAdjacentElement("afterend", currentRow);
		}
	}

	// Add table data into newly created rows
	for(k = 0; k < Math.min(data.length, carsPerPage); k++){
		document.getElementById("result" + data[k].id).innerHTML = data[k].number + " - " + data[k].driver;
		document.getElementById("image" + data[k].id).src = data[k].imageCar;
	}

	// Create appropriate number of pagination links
	// and append to bottom of page
	newDiv = document.createElement("div");
	newDiv.setAttribute("class", "pagination");
	newDiv.setAttribute("id", "pages");
	for(m = 0; m < data.length / carsPerPage; m++){
		newLink = document.createElement("a");
		newLink.href = "#" + m;
		newLink.innerText = m + 1;
		newDiv.appendChild(newLink);
	}
	document.body.appendChild(newDiv);
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
	// Delete all previously created rows
	// NOT GREAT
	// IMPROVE LATER
	var i;
	var pages = document.getElementById("pages");
	if(pages){
		pages.remove();
	}
	for(i = 200; i > -1; i--){
		var thisRow = document.getElementById("row" + i);
		if(thisRow){
			thisRow.remove();
		}
	}
}

function searchCar() {
	var queryString = "SELECT * FROM carInfo ";
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
	loadTable(queryString);
}

$(document).ready(function() {
	// Load all table entries when first loading page
	loadTable("SELECT * FROM carInfo");

	if(window.location.href.indexOf("individual_page") == -1) {
		var searchBars = document.getElementById("searchBars");
		var clearButton = document.getElementById("clearButton");
		var submitButton = document.getElementById("submitButton");
		var page2 = document.getElementById("page2");

		searchBars.addEventListener("keypress", function(event) {
			if(event.key === "Enter") {
				searchCar();
			}
		});
		submitButton.addEventListener("click", function() {
			searchCar();
		});

		clearButton.addEventListener("click", function() {
			document.getElementById("searchDriver").value = "";
			document.getElementById("searchNumber").value = "";
			document.getElementById("searchSeries").value = "";
			document.getElementById("searchSponsor").value = "";
			document.getElementById("searchManufacturer").value = "";
			document.getElementById("searchYear").value = "";
		});
	}
});
