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

	console.log(sessionStorage.getItem("selectDriver"));

	// Number of rows and columns to display per page
	var numRows = 10;
	var numCols = 10;
	var carsPerPage = numRows * numCols;
	var numCars = tableData.length;

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
			if(j < numCars){
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
		//console.log("m: " + m);
		//console.log(m - 1);
		pageSelect.options.add(new Option(m, m - 1));
		//console.log(pageSelect.options[pageSelect.options.length].value);
	}

	// Correct the starting page select value
	//console.log(pageNum);
	pageSelect.value = pageNum;

	buildSelects(tableData);
}

function clearPage() {
	// NOT GREAT
	// IMPROVE LATER

	// Delete all page select options
	var pageSelect = document.getElementById("pageSelect");
	for(var i = pageSelect.options.length - 1; i > 0; i--){
		pageSelect.remove(i);
	}

	console.log(sessionStorage.getItem(selectDriver));
	removeSelectTerms(selectDriver);
	removeSelectTerms(selectNumber);
	removeSelectTerms(selectSeries);
	removeSelectTerms(selectSponsor);
	removeSelectTerms(selectTeam);
	removeSelectTerms(selectManufacturer);
	removeSelectTerms(selectYear);

	// Delete all previous dynamic HTML
	for(var j = 200; j > -1; j--){
		var thisRow = document.getElementById("row" + j);
		if(thisRow){
			thisRow.remove();
		}
	}
}

function removeSelectTerms(element){
	for(var i = element.options.length - 1; i > 0; i--){
		element.remove(i);
	}
}

function createSearchData(tableData) {
	//console.log(tableData);
	var searchData = [];
	var pageSelect = document.getElementById("pageSelect");

	// Delete previous search data if it exists
	if(sessionStorage.getItem("searchData") != null){
		sessionStorage.removeItem("searchData");
	}

	// Get all values from search fields
	var driverValue = selectDriver.value;
	var numberValue = selectNumber.value;
	var seriesValue = selectSeries.value;
	var sponsorValue = selectSponsor.value;
	var teamValue = selectTeam.value;
	var manufacturerValue = selectManufacturer.value;
	var yearValue = selectYear.value;

	sessionStorage.setItem("selectDriver", driverValue);
	sessionStorage.setItem("selectNumber", numberValue);
	sessionStorage.setItem("selectSeries", seriesValue);
	sessionStorage.setItem("selectSponsor", sponsorValue);
	sessionStorage.setItem("selectTeam", teamValue);
	sessionStorage.setItem("selectManufacturer", manufacturerValue);
	sessionStorage.setItem("selectYear", yearValue);

	// If all fields are empty, clear searchData and regenerate page
	/*if(selectDriver.length == 0 && selectNumber.length == 0 &&
		selectSeries.length == 0 && selectSponsor.length == 0 &&
		selectTeam.length == 0 && selectManufacturer.length == 0 &&
		selectYear.length == 0){
		sessionStorage.removeItem("searchData");
		clearPage();
		generateMain(tableData, 0);
		return;
	}*/

	// If any entries in tableData match ALL inputs, add it to searchData
	for(var i = 0; i < tableData.length; i++){
		var currentDriver = tableData[i].driver;
		var currentNumber = tableData[i].number;
		var currentSeries = tableData[i].series;
		var currentSponsor = tableData[i].sponsor;
		var currentTeam = tableData[i].team;
		var currentManufacturer = tableData[i].manufacturer;
		var currentYear = tableData[i].year;

		if(currentDriver.includes(driverValue) && currentNumber.includes(numberValue)
			&& currentSeries.includes(seriesValue) && currentSponsor.includes(sponsorValue)
			&& currentTeam.includes(teamValue) && currentManufacturer.includes(manufacturerValue)
			&& currentYear.includes(yearValue)){
			searchData.push(tableData[i]);
		}
	}

	// Add searchData to sessionStorage and regenerate page
	sessionStorage.setItem("searchData", JSON.stringify(searchData));
	console.log(searchData);
	
	sessionStorage.setItem("pageNum", 0);
	pageSelect.value = 0;

	clearPage();
	generateMain(searchData, sessionStorage.getItem("pageNum"));

}

function buildSelects(tableData) {
	console.log(tableData);

	var listDrivers = [];
	var listNumbers = [];
	var listSeries = [];
	var listSponsors = [];
	var listTeams = [];
	var listManufacturers = [];
	var listYears = [];

	var index = 0;
	for(var i = 0; i < tableData.length; i++){
		addToList(listDrivers, tableData[i].driver);
		addToList(listNumbers, tableData[i].number);
		addToList(listSeries, tableData[i].series);
		addToList(listSponsors, tableData[i].sponsor);
		addToList(listTeams, tableData[i].team);
		addToList(listManufacturers, tableData[i].manufacturer);
		addToList(listYears, tableData[i].year);
	}

	addToSelect(selectDriver, listDrivers);
	addToSelect(selectNumber, listNumbers);
	addToSelect(selectSeries, listSeries);
	addToSelect(selectSponsor, listSponsors);
	addToSelect(selectTeam, listTeams);
	addToSelect(selectManufacturer, listManufacturers);
	addToSelect(selectYear, listYears);

}

function addToList(arr, value){
	if(!arr.find(e => e.key === value)){
		arr.push({key: value, num: 1});
	} else {
		var index = arr.findIndex(o => {return o.key === value;});
		arr[index].num += 1;
	}
}

function addToSelect(element, arr){
	for(var i = 0; i < arr.length; i++){
		element.options.add(new Option(arr[i].key + " (" + arr[i].num + ")", arr[i].key));
		if(element.options[i].value === sessionStorage.getItem(element)){
			element.options[i].selected = true;
		}
	}
	//arr.options[arr.options.indexOf(sessionStorage.getItem(element))].selected = true;
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

	//console.log(sessionStorage.getItem("selectDriver"));
	if(sessionStorage.getItem("selectDriver") != null){
		//console.log(sessionStorage.getItem("selectDriver"));
		//console.log("selectDriver found");
		selectDriver.options[selectDriver.options.selectedIndex].selected = true;
	} else {
		console.log("selectDriver not found");
		selectDriver.value = "";
	}

	if(sessionStorage.getItem("selectNumber") != null){
		selectNumber.value = sessionStorage.getItem("selectNumber");
	} else {
		selectNumber.value = "";
	}
	
	/*selectSeries.value = sessionStorage.getItem("selectSeries");
	selectSponsor.value = sessionStorage.getItem("selectSponsor");
	selectTeam.value = sessionStorage.getItem("selectTeam");
	selectManufacturer.value = sessionStorage.getItem("selectManufacturer");
	selectYear.value = sessionStorage.getItem("selectYear");*/

	//var searchBars = document.getElementById("searchBars");
	var clearButton = document.getElementById("clearButton");
	var submitButton = document.getElementById("submitButton");
	var pageSelect = document.getElementById("pageSelect");

	// Perform search function if either "Submit" button is clicked
	// or Enter key ius pressed in any box
	//searchBars.addEventListener("keypress", function(event) {
		//if(event.key === "Enter") {
			//createSearchData(tableData);
		//}
	//});
	submitButton.addEventListener("click", function() {
		/*selectDriver.value = sessionStorage.getItem("selectDriver");
		selectNumber.value = sessionStorage.getItem("selectNumber");
		selectSeries.value = sessionStorage.getItem("selectSeries");
		selectSponsor.value = sessionStorage.getItem("selectSponsor");
		selectTeam.value = sessionStorage.getItem("selectTeam");
		selectManufacturer.value = sessionStorage.getItem("selectManufacturer");
		selectYear.value = sessionStorage.getItem("selectYear");*/
		createSearchData(tableData);
	});

	/*selectDriver.addEventListener("change", function() {
		console.log(selectDriver.value);
		//if(searchData != null){
			//createSearchData(searchData);
		//} else {
			createSearchData(tableData);
		//}
	});

	selectNumber.addEventListener("change", function() {
		//if(searchData != null){
			//createSearchData(searchData);
		//} else {
			createSearchData(tableData);
		//}
	});

	selectSeries.addEventListener("change", function() {
		if(searchData != null){
			createSearchData(searchData);
		} else {
			createSearchData(tableData);
		}
	});

	selectSponsor.addEventListener("change", function() {
		if(searchData != null){
			createSearchData(searchData);
		} else {
			createSearchData(tableData);
		}
	});

	selectTeam.addEventListener("change", function() {
		if(searchData != null){
			createSearchData(searchData);
		} else {
			createSearchData(tableData);
		}
	});

	selectManufacturer.addEventListener("change", function() {
		if(searchData != null){
			createSearchData(searchData);
		} else {
			createSearchData(tableData);
		}
	});

	selectYear.addEventListener("change", function() {
		if(searchData != null){
			createSearchData(searchData);
		} else {
			createSearchData(tableData);
		}
	});*/


	// Clear all search inputs
	clearButton.addEventListener("click", function() {
		selectDriver.value = "";
		selectNumber.value = "";
		selectSeries.value = "";
		selectSponsor.value = "";
		selectTeam.value = "";
		selectManufacturer.value = "";
		selectYear.value = "";

		sessionStorage.setItem("selectDriver", "");
		sessionStorage.setItem("selectNumber", "");
		sessionStorage.setItem("selectSeries", "");
		sessionStorage.setItem("selectSponsor", "");
		sessionStorage.setItem("selectTeam", "");
		sessionStorage.setItem("selectManufacturer", "");
		sessionStorage.setItem("selectYear", "");
	});

	// Reload page for corresponding selection
	pageSelect.addEventListener("change", function() {
		sessionStorage.setItem("pageNum", pageSelect.value);
		clearPage();
		
		//console.log(sessionStorage.getItem("pageNum"));
		// If user performed a search, reload the page corresponding to searchData
		// If not, reload corresponding to the full table
		if(sessionStorage.getItem("searchData") != null){
			generateMain(JSON.parse(sessionStorage.getItem("searchData")), sessionStorage.getItem("pageNum"));
		} else {
			generateMain(tableData, sessionStorage.getItem("pageNum"));
		}
	});
}

var selectDriver = document.getElementById("selectDriver");
var selectNumber = document.getElementById("selectNumber");
var selectSeries = document.getElementById("selectSeries");
var selectSponsor = document.getElementById("selectSponsor");
var selectTeam = document.getElementById("selectTeam");
var selectManufacturer = document.getElementById("selectManufacturer");
var selectYear = document.getElementById("selectYear");

window.addEventListener("load", function() {
	getTableData();
});