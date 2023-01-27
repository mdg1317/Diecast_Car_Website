// Author: Matthew Groh
// Last Updated: 1/26/2023
//
// index.js
//
// This script loads the full table from the SQL database, displays the main
// page, and handles the filter functionality

const getTableData = async () => {
	var tableData = [];
	var filterData = null;
	// If data is already in sessionStorage, load it into tableData
	// If not, perform SQL query and load that into tableData AND sessionStorage
	// After either is done, call finishLoading() to continue
	if(sessionStorage.getItem("tableData") != null){
		tableData = JSON.parse(sessionStorage.getItem("tableData"));
		// Set filterData if it exists
		if(sessionStorage.getItem("filterData") != null){
			filterData = JSON.parse(sessionStorage.getItem("filterData"));
		}
		finishLoading(tableData, filterData);
	} else {
		// Send a POST request invoking "/tableData" route found in app.js
		$.post({
			traditional: true,
			url: "/tableData",
			success: function(data, ) {
				sessionStorage.setItem("tableData", JSON.stringify(data));
				tableData = JSON.parse(sessionStorage.getItem("tableData"));
				finishLoading(tableData, filterData);
			}
		}).fail(function(jqxhr, settings, ex) {
			console.log("Could not access table");
		});
	}
};

function generateMain(tableData, pageNum){
	var currentRow, newDiv, newLink, newImg, newP;
	var resultsCounter = document.getElementById("resultsCounter");

	// If results have already been generated, clear the page before regenerating
	// (Primarily for the resizing function)
	if(document.getElementById("row0") != null){
		clearPage();
	}

	var numCars = tableData.length;
	var carsPerPage = 50;

	// Set number of columns to how many can fit on current window size, or 1 if super small
	// Get number of rows by dividing number of cars by number of columns
	// Then add appropriate number of extra rows for overflow
	var numCols = Math.max(1, Math.floor(window.innerWidth / 202));
	var numRows = Math.round(carsPerPage / numCols);
	var extraRows = Math.ceil((carsPerPage - (numRows * numCols)) / numCols);
	numRows += extraRows;

	var endOfPage = false;

	for(var i = 0; i < numRows; i++){
		// If end of table is reached, stop making rows
		if(i * numCols > numCars){
			break;
		}

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
			// If reached end of page, set endOfPage flag
			// This will still create columns for formatting purposes but
			// will not populate them
			if(j != startingID && j % carsPerPage == 0){
				endOfPage = true;
			}

			// Create new column
			newDiv = document.createElement("div");
			newDiv.setAttribute("class", "column");

			// Only add links, images, and text if end of
			// data or end of page has not been reached
			if(!endOfPage && j < numCars){
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
	var startingNum = Math.min(numCars, ((carsPerPage * parseInt(pageNum)) + 1));
	var endingNum = Math.min(numCars, carsPerPage * (parseInt(pageNum) + 1));
	resultsCounter.innerHTML = "Displaying " + startingNum + " - "
		+ endingNum + " of " + numCars + " results";

	// Add table data into newly created rows
	var index = pageNum * carsPerPage;
	var counter = 0;
	for(var k = index; k < numCars; k++){
		// Break loop if max number of cars on page is reached
		if(counter == carsPerPage){
			break;
		}
		document.getElementById("result" + tableData[k].id).innerHTML = tableData[k].number + " - " + tableData[k].driver;
		document.getElementById("image" + tableData[k].id).src = "thumbnails/" + tableData[k].image0;
		counter++;
	}

	// Add appropriate number of page select options
	var pageSelect = document.getElementById("pageSelect");
	for(var m = 2; m < Math.ceil(numCars / carsPerPage) + 1; m++){
		pageSelect.options.add(new Option(m, m - 1));
	}

	// Correct the starting page select value
	pageSelect.value = pageNum;
}

function clearPage() {
	// NOT GREAT
	// IMPROVE LATER

	// Delete all page select options
	var pageSelect = document.getElementById("pageSelect");
	for(var i = pageSelect.options.length - 1; i > 0; i--){
		pageSelect.remove(i);
	}

	// Delete all previous dynamic HTML
	for(var j = 49; j > -1; j--){
		var thisRow = document.getElementById("row" + j);
		if(thisRow){
			thisRow.remove();
		}
	}
}

function createFilterData(tableData) {
	var filterData = [];
	var pageSelect = document.getElementById("pageSelect");

	// Delete previous filters if they exist
	if(sessionStorage.getItem("filterData") != null){
		sessionStorage.removeItem("filterData");
	}

	// Get all values from filter fields
	var driverValue = filterDriver.value;
	var numberValue = filterNumber.value;
	var seriesValue = filterSeries.value;
	var sponsorValue = filterSponsor.value;
	var teamValue = filterTeam.value;
	var manufacturerValue = filterManufacturer.value;
	var yearValue = filterYear.value;
	var otherValue = filterOther.value;

	// Store filters in sessionStorage so they will
	// persist when reloading pages without changing them
	sessionStorage.setItem("filterDriver", driverValue);
	sessionStorage.setItem("filterNumber", numberValue);
	sessionStorage.setItem("filterSeries", seriesValue);
	sessionStorage.setItem("filterSponsor", sponsorValue);
	sessionStorage.setItem("filterTeam", teamValue);
	sessionStorage.setItem("filterManufacturer", manufacturerValue);
	sessionStorage.setItem("filterYear", yearValue);
	sessionStorage.setItem("filterOther", otherValue);

	// Remove punctuation and properly format inputted terms
	driverValue = driverValue.replace(/\./g, '').replace(/\//g, ' ').toLowerCase().trim();
	numberValue = numberValue.trim();
	seriesValue = seriesValue.toLowerCase().trim();
	sponsorValue = sponsorValue.replace(/[\.\'#\:\?\$,]/g, '').replace(/[-\/]/g, ' ').replace(/\s{2,}/g, ' ').toLowerCase().trim();
	teamValue = teamValue.replace(/[/-\/]/g, ' ').replace(/[\.,]/g, '').toLowerCase().trim();
	manufacturerValue = manufacturerValue.toLowerCase().trim();
	yearValue = yearValue.trim();
	otherValue = otherValue.replace(/[\.\'#\:\?\$,]/g, '').replace(/[-\/]/g, ' ').replace(/\s{2,}/g, ' ').toLowerCase().trim();

	// If all fields are empty, clear filterData and regenerate page
	if(driverValue.length == 0 && numberValue.length == 0 &&
		seriesValue.length == 0 && sponsorValue.length == 0 &&
		teamValue.length == 0 && manufacturerValue.length == 0 &&
		yearValue.length == 0 && otherValue == 0){
		sessionStorage.removeItem("filterData");
		clearPage();
		generateMain(tableData, 0);
		return;
	}

	// If any entries in tableData match ALL inputs, add it to filterData
	for(var i = 0; i < tableData.length; i++){
		// Get and format table data to match inputted terms
		var currentDriver = tableData[i].driver.replace(/\./g, '').replace(/\//g, ' ').toLowerCase();
		var currentNumber = tableData[i].number;
		var currentSeries = tableData[i].series.toLowerCase();
		var currentSponsor = tableData[i].sponsor.replace(/[\.\'#\:\?\$,]/g, '').replace(/[-\/]/g, ' ').replace(/\s{2,}/g, ' ').toLowerCase();
		var currentTeam = tableData[i].team.replace(/[/-\/]/g, ' ').replace(/[\.,]/g, '').toLowerCase();
		var currentManufacturer = tableData[i].manufacturer.toLowerCase();
		var currentYear = tableData[i].year;
		var currentOther = tableData[i].other.replace(/[\.\'#\:\?\$,]/g, '').replace(/[-\/]/g, ' ').replace(/\s{2,}/g, ' ').toLowerCase();

		if(currentDriver.includes(driverValue) && currentNumber.includes(numberValue)
			&& currentSeries.includes(seriesValue) && currentSponsor.includes(sponsorValue)
			&& currentTeam.includes(teamValue) && currentManufacturer.includes(manufacturerValue)
			&& currentYear.includes(yearValue) && currentOther.includes(otherValue)){
			filterData.push(tableData[i]);
		}
	}

	// Add filterData to sessionStorage and regenerate page
	sessionStorage.setItem("filterData", JSON.stringify(filterData));
	
	// Reset page number
	sessionStorage.setItem("pageNum", 0);
	pageSelect.value = 0;

	// Regenerate page
	clearPage();
	generateMain(filterData, sessionStorage.getItem("pageNum"));

}

function finishLoading(tableData, filterData) {
	// Generate dynamic HTML using filterData if it exists
	// If not, use full table data
	if(sessionStorage.getItem("pageNum") == null){
		sessionStorage.setItem("pageNum", 0);
	}
	if(filterData != null){
		generateMain(filterData, sessionStorage.getItem("pageNum"));
	} else {
		generateMain(tableData, sessionStorage.getItem("pageNum"));
	}

	// Set filters to those found in sessionStorage
	filterDriver.value = sessionStorage.getItem("filterDriver");
	filterNumber.value = sessionStorage.getItem("filterNumber");
	filterSeries.value = sessionStorage.getItem("filterSeries");
	filterSponsor.value = sessionStorage.getItem("filterSponsor");
	filterTeam.value = sessionStorage.getItem("filterTeam");
	filterManufacturer.value = sessionStorage.getItem("filterManufacturer");
	filterYear.value = sessionStorage.getItem("filterYear");
	filterOther.value = sessionStorage.getItem("filterOther");

	var filters = document.getElementById("filters");
	var clearButton = document.getElementById("clearButton");
	var submitButton = document.getElementById("submitButton");
	var pageSelect = document.getElementById("pageSelect");

	// Filter results in real time as characters are typed
	filters.addEventListener("keyup", function(event) {
		createFilterData(tableData);
	});

	// Clear all filters from both the page and sessionStorage and reload
	clearButton.addEventListener("click", function() {
		filterDriver.value = "";
		filterNumber.value = "";
		filterSeries.value = "";
		filterSponsor.value = "";
		filterTeam.value = "";
		filterManufacturer.value = "";
		filterYear.value = "";
		filterOther.value = "";

		sessionStorage.setItem("filterDriver", "");
		sessionStorage.setItem("filterNumber", "");
		sessionStorage.setItem("filterSeries", "");
		sessionStorage.setItem("filterSponsor", "");
		sessionStorage.setItem("filterTeam", "");
		sessionStorage.setItem("filterManufacturer", "");
		sessionStorage.setItem("filterYear", "");
		sessionStorage.setItem("filterOther", "");

		createFilterData(tableData);
	});

	// Reload page for corresponding selection
	pageSelect.addEventListener("change", function() {
		sessionStorage.setItem("pageNum", pageSelect.value);
		clearPage();
		
		// If user used one or more filters, reload the page corresponding to filterData
		// If not, reload corresponding to the full table
		if(sessionStorage.getItem("filterData") != null){
			generateMain(JSON.parse(sessionStorage.getItem("filterData")), sessionStorage.getItem("pageNum"));
		} else {
			generateMain(tableData, sessionStorage.getItem("pageNum"));
		}
	});
}

window.addEventListener("load", function() {
	window.scrollTo(0, 0);
	getTableData();
});

window.addEventListener("resize", function() {
	// Regenerate page with appropriate table and new window size
	if(sessionStorage.getItem("filterData") != null){
		generateMain(JSON.parse(sessionStorage.getItem("filterData")), sessionStorage.getItem("pageNum"));
	} else {
		generateMain(JSON.parse(sessionStorage.getItem("tableData")), sessionStorage.getItem("pageNum"));
	}
});