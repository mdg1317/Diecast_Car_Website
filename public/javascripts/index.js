// Author: Matthew Groh
// Last Updated: 8/16/2022
//
// index.js
//
// This script loads the full table from the SQL database, displays the main
// page, and handles the search functionality

const getTableData = async () => {
	var tableData = [];
	var searchData = null;
	// If data is already in sessionStorage, load it into tableData
	// If not, perform SQL query and load that into tableData AND sessionStorage
	// After either is done, call finishLoading() to continue
	if(sessionStorage.getItem("tableData") != null){
		tableData = JSON.parse(sessionStorage.getItem("tableData"));
		// Set searchData if it exists
		if(sessionStorage.getItem("searchData") != null){
			searchData = JSON.parse(sessionStorage.getItem("searchData"));
		}
		finishLoading(tableData, searchData);
	} else {
		// Send a POST request invoking "/tableData" route found in app.js
		$.post({
			traditional: true,
			url: "/tableData",
			success: function(data, ) {
				sessionStorage.setItem("tableData", JSON.stringify(data));
				tableData = JSON.parse(sessionStorage.getItem("tableData"));
				finishLoading(tableData, searchData);
			}
		}).fail(function(jqxhr, settings, ex) {
			console.log("Could not access table");
		});
	}
};

function generateMain(tableData, pageNum){
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
			if(j < tableData.length){
				newLink = document.createElement("a");
				newImg = document.createElement("img");
				newP = document.createElement("p");

				newLink.href = "individual_page.html?" + tableData[j].id;
				newImg.setAttribute("id", "image" + tableData[j].id);
				newP.setAttribute("id", "result" + tableData[j].id);

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
	var startingNum = Math.min(tableData.length, ((carsPerPage * parseInt(pageNum)) + 1));
	var endingNum = Math.min(tableData.length, carsPerPage * (parseInt(pageNum) + 1));
	resultsCounter.innerHTML = "Displaying " + startingNum + " - "
		+ endingNum + " of " + tableData.length + " results";

	// Add table data into newly created rows
	var index = pageNum * carsPerPage;
	var counter = 0;
	for(var k = index; k < tableData.length; k++){
		// Break loop if max number of cars on page is reached
		if(counter == carsPerPage){
			break;
		}
		document.getElementById("result" + tableData[k].id).innerHTML = tableData[k].number + " - " + tableData[k].driver;
		document.getElementById("image" + tableData[k].id).src = "thumbnails/" + tableData[k].image0;
		counter++;
	}

	// Hide unnecessary page select options
	var pageSelect = document.getElementById("pageSelect");
	for(var m = 19; m >= tableData.length / carsPerPage; m--){
		pageSelect[m].hidden = true;
	}

	// Correct the starting page select value
	pageSelect.value = pageNum;
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

function createSearchData(tableData) {
	var searchData = [];
	var pageSelect = document.getElementById("pageSelect");

	// Delete previous search data if it exists
	if(sessionStorage.getItem("searchData") != null){
		sessionStorage.removeItem("searchData");
	}

	// Get all values from search fields
	var searchDriver = document.getElementById("searchDriver").value.toLowerCase();
	var searchNumber = document.getElementById("searchNumber").value;
	var searchSeries = document.getElementById("searchSeries").value;
	var searchSponsor = document.getElementById("searchSponsor").value;
	var searchManufacturer = document.getElementById("searchManufacturer").value;
	var searchYear = document.getElementById("searchYear").value;

	sessionStorage.setItem("searchDriver", searchDriver);
	sessionStorage.setItem("searchNumber", searchNumber);
	sessionStorage.setItem("searchSeries", searchSeries);
	sessionStorage.setItem("searchSponsor", searchSponsor);
	sessionStorage.setItem("searchManufacturer", searchManufacturer);
	sessionStorage.setItem("searchYear", searchYear);

	// If all fields are empty, clear searchData and regenerate page
	if(searchDriver.length == 0 && searchNumber.length == 0 &&
		searchSeries.length == 0 && searchSponsor.length == 0 &&
		searchManufacturer.length == 0 && searchYear.length == 0){
		sessionStorage.removeItem("searchData");
		clearPage();
		generateMain(tableData, 0);
		return;
	}

	// If any entries in tableData match ALL inputs, add it to searchData
	for(var i = 0; i < tableData.length; i++){
		var currentDriver = tableData[i].driver.toLowerCase();
		var currentNumber = tableData[i].number;
		var currentSeries = tableData[i].series.toLowerCase();
		var currentSponsor = tableData[i].sponsor.toLowerCase();
		var currentManufacturer = tableData[i].manufacturer.toLowerCase();
		var currentYear = tableData[i].year;

		if(currentDriver.includes(searchDriver) && currentNumber.includes(searchNumber)
			&& currentSeries.includes(searchSeries) && currentSponsor.includes(searchSponsor)
			&& currentManufacturer.includes(searchManufacturer) && currentYear.includes(searchYear)){
			searchData.push(tableData[i]);
		}
	}

	// Add searchData to sessionStorage and regenerate page
	sessionStorage.setItem("searchData", JSON.stringify(searchData));
	
	sessionStorage.setItem("pageNum", 0);
	pageSelect.value = 0;

	clearPage();
	generateMain(searchData, sessionStorage.getItem("pageNum"));

}

function finishLoading(tableData, searchData) {
	// Generate dynamic HTML using searchData if it exists
	// If not, use full table data
	if(sessionStorage.getItem("pageNum") == null){
		sessionStorage.setItem("pageNum", 0);
	}
	if(searchData != null){
		generateMain(searchData, sessionStorage.getItem("pageNum"));
	} else {
		generateMain(tableData, sessionStorage.getItem("pageNum"));
	}

	var searchDriver = document.getElementById("searchDriver");
	var searchNumber = document.getElementById("searchNumber");
	var searchSeries = document.getElementById("searchSeries");
	var searchSponsor = document.getElementById("searchSponsor");
	var searchManufacturer = document.getElementById("searchManufacturer");
	var searchYear = document.getElementById("searchYear");

	searchDriver.value = sessionStorage.getItem("searchDriver");
	searchNumber.value = sessionStorage.getItem("searchNumber");
	searchSeries.value = sessionStorage.getItem("searchSeries");
	searchSponsor.value = sessionStorage.getItem("searchSponsor");
	searchManufacturer.value = sessionStorage.getItem("searchManufacturer");
	searchYear.value = sessionStorage.getItem("searchYear");

	var searchBars = document.getElementById("searchBars");
	var clearButton = document.getElementById("clearButton");
	var submitButton = document.getElementById("submitButton");
	var pageSelect = document.getElementById("pageSelect");

	// Perform search function if either "Submit" button is clicked
	// or Enter key ius pressed in any box
	searchBars.addEventListener("keypress", function(event) {
		if(event.key === "Enter") {
			createSearchData(tableData);
		}
	});
	submitButton.addEventListener("click", function() {
		createSearchData(tableData);
	});


	// Clear all search inputs
	clearButton.addEventListener("click", function() {
		searchDriver.value = "";
		searchNumber.value = "";
		searchSeries.value = "";
		searchSponsor.value = "";
		searchManufacturer.value = "";
		searchYear.value = "";

		sessionStorage.setItem("searchDriver", "");
		sessionStorage.setItem("searchNumber", "");
		sessionStorage.setItem("searchSeries", "");
		sessionStorage.setItem("searchSponsor", "");
		sessionStorage.setItem("searchManufacturer", "");
		sessionStorage.setItem("searchYear", "");
	});

	// Reload page for corresponding selection
	pageSelect.addEventListener("change", function() {
		clearPage();

		sessionStorage.setItem("pageNum", pageSelect.value);
		// If user performed a search, reload the page corresponding to searchData
		// If not, reload corresponding to the full table
		if(sessionStorage.getItem("searchData") != null){
			generateMain(JSON.parse(sessionStorage.getItem("searchData")), sessionStorage.getItem("pageNum"));
		} else {
			generateMain(tableData, sessionStorage.getItem("pageNum"));
		}
	});
}

window.addEventListener("load", function() {
	getTableData();
});