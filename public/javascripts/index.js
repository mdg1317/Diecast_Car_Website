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
	var numCols = Math.max(1, Math.floor(window.innerWidth / 180));
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
	//var carIDs = [];
	for(var k = index; k < numCars; k++){
		// Break loop if max number of cars on page is reached
		if(counter == carsPerPage){
			break;
		}
		document.getElementById("result" + tableData[k].id).innerHTML = tableData[k].number + " - " + tableData[k].driver;
		document.getElementById("image" + tableData[k].id).src = "thumbnails/" + tableData[k].image0;

		// Add car ID to array for image checking
		//carIDs.push(tableData[k].id);

		counter++;
	}

	// Check if image0 exists for all cars on page
	//checkImages(tableData, carIDs);

	// Add appropriate number of page select options
	var pageSelect = document.getElementById("pageSelect");
	for(var m = 2; m < Math.ceil(numCars / carsPerPage) + 1; m++){
		pageSelect.options.add(new Option(m, m - 1));
	}
	if(pageSelect.length == 1){
		pageSelect.disabled = true;
	} else {
		pageSelect.disabled = false;
	}

	// Correct the starting page select and sort select values
	pageSelect.value = pageNum;
	sortSelect.value = sessionStorage.getItem("sortType");

	// If returning from individual page, center last viewed car on the page
	if(sessionStorage.getItem("savedID") != null){
		document.getElementById("image" + sessionStorage.getItem("savedID")).scrollIntoView({
			behavior: "auto",
			block: "center",
			inline: "center"
		});
		sessionStorage.removeItem("savedID");
	}
}

/*const checkImages = async (tableData, carIDs) => {
	// Iterate through list of cars and check if image0 exists
	// for all of them. If so, display it. If not, display default image
	const promises = await carIDs.map(async item => {
		var car = tableData.find(o => o.id == item);
		fetch("thumbnails/" + car.image0) 
			.then(response => { 
				if (!response.ok) {
					document.getElementById("image" + car.id).src = "images/NoImageAvailable.jpg";
					throw new Error("Image not found");
				} else {
					document.getElementById("image" + car.id).src = "thumbnails/" + car.image0;
				} 
			}) 
			.catch(error => { 
				console.log(error); 
			});
	})
}*/

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

function sortTable(tableData, isFilter, sort){
	// Lists storing the proper order for certain fields
	// NOT A VERY EFFICIENT WAY OF DOING THE NUMBERS
	// TRY TO IMPROVE LATER
	var numberOrder = ["00", "0", "01", "1", "02", "2", "03", "3", "04", "4",
		"05", "5", "06", "6", "07", "7", "08", "8", "09", "9", "10",
		"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
		"21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
		"31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
		"41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
		"51", "52", "53", "54", "55", "56", "57", "58", "59", "60",
		"61", "62", "63", "64", "65", "66", "67", "68", "69", "70",
		"71", "72", "73", "74", "75", "76", "77", "78", "79", "80",
		"81", "82", "83", "84", "85", "86", "87", "88", "89", "90",
		"91", "92", "93", "94", "95", "96", "97", "98", "99"];
	var seriesOrder = ["Cup", "Xfinity", "Truck", "ARCA", "None"];
	var manufacturerOrder = ["Buick", "Chevrolet", "Dodge", "Ford",
		"Oldsmobile", "Plymouth", "Pontiac", "Toyota", "None"];

	// Sort in order of Number -> Series -> Year first, unless
	// specific sort categories are chosen
	if(sort !== "0" && sort !== "4" && sort !== "8"){
		tableData.sort(function(a, b){
			return a.year - b.year;
		});
		tableData.sort(function(a, b){
			return seriesOrder.indexOf(a.series) - seriesOrder.indexOf(b.series);
		});
		tableData.sort(function(a, b){
			return numberOrder.indexOf(a.number) - numberOrder.indexOf(b.number);
		});	
	}

	// Perform the last sort depending on chosen option
	switch(sort){
		case "0":		// ID 
			tableData.sort(function(a, b){
				return a.id - b.id;
			});
			break;
		case "1":		// First Name
			tableData.sort(function(a, b){
				var x = a.driver;
				var y = b.driver;
				return x == y ? 0 : x > y ? 1 : -1;
			});
			break;
		case "2":		// Last Name
			tableData.sort(function(a, b){
				var x = a.driver.substring(a.driver.indexOf(' ') + 1);
				var y = b.driver.substring(b.driver.indexOf(' ') + 1);
				return x == y ? 0 : x > y ? 1 : -1;
			});
			break;
		case "3": 		// Number
			break;
		case "4": 		// Series
			tableData.sort(function(a, b){
				return a.year - b.year;
			});
			tableData.sort(function(a, b){
				return numberOrder.indexOf(a.number) - numberOrder.indexOf(b.number);
			});
			tableData.sort(function(a, b){
				return seriesOrder.indexOf(a.series) - seriesOrder.indexOf(b.series);
			});
			break;
		case "5":		// Sponsor
			tableData.sort(function(a, b){
				var x = a.sponsor.replace('#','').toLowerCase();
				var y = b.sponsor.replace('#','').toLowerCase();
				return x == y ? 0 : x > y ? 1 : -1;
			});
			break;
		case "6":		// Team
			tableData.sort(function(a, b){
				var x = a.team.toLowerCase();
				var y = b.team.toLowerCase();
				return x == y ? 0 : x > y ? 1 : -1;
			});
			break;
		case "7":		// Manufacturer
			tableData.sort(function(a, b){
				return manufacturerOrder.indexOf(a.manufacturer)
					- manufacturerOrder.indexOf(b.manufacturer);
			});
			break;
		case "8": 		// Year
			// Sort in order of Year -> Series -> Number
			tableData.sort(function(a, b){
				return numberOrder.indexOf(a.number) - numberOrder.indexOf(b.number);
			});
			tableData.sort(function(a, b){
				return seriesOrder.indexOf(a.series) - seriesOrder.indexOf(b.series);
			});
			tableData.sort(function(a, b){
				return a.year - b.year;
			});
			break;
		default:
			break;
	}
	
	// If using filterData, replace in sessionStorage with sorted data
	// If not, replace tableData
	if(isFilter){
		sessionStorage.setItem("filterData", JSON.stringify(tableData));
	} else {
		sessionStorage.setItem("tableData", JSON.stringify(tableData));
	}

	// Rebuild page
	clearPage();
	generateMain(tableData, sessionStorage.getItem("pageNum"));
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
	if(sessionStorage.getItem("sortType") == null){
		sessionStorage.setItem("sortType", 0);
		console.log(sessionStorage.getItem("sortType"));
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

	// Filter results in real time as characters are typed
	filters.addEventListener("keyup", function(event) {
		createFilterData(tableData);
	});

	// Clear data only from respective filter and reload
	clearDriver.addEventListener("click", function() {
		clearFilterData(tableData, "filterDriver")
	});
	clearNumber.addEventListener("click", function() {
		clearFilterData(tableData, "filterNumber")
	});
	clearSeries.addEventListener("click", function() {
		clearFilterData(tableData, "filterSeries")
	});
	clearSponsor.addEventListener("click", function() {
		clearFilterData(tableData, "filterSponsor")
	});
	clearTeam.addEventListener("click", function() {
		clearFilterData(tableData, "filterTeam")
	});
	clearManufacturer.addEventListener("click", function() {
		clearFilterData(tableData, "filterManufacturer")
	});
	clearYear.addEventListener("click", function() {
		clearFilterData(tableData, "filterYear")
	});
	clearOther.addEventListener("click", function() {
		clearFilterData(tableData, "filterOther")
	});

	// Clear all filters from both the page and sessionStorage and reload
	clearAll.addEventListener("click", function() {
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
		
		window.scrollTo(0, 0);
		// If user used one or more filters, reload the page corresponding to filterData
		// If not, reload corresponding to the full table
		if(sessionStorage.getItem("filterData") != null){
			generateMain(JSON.parse(sessionStorage.getItem("filterData")), sessionStorage.getItem("pageNum"));
		} else {
			generateMain(tableData, sessionStorage.getItem("pageNum"));
		}
	});

	sortSelect.addEventListener("change", function() {
		sessionStorage.setItem("sortType", sortSelect.value);
		if(sessionStorage.getItem("filterData") != null){
			sortTable(filterData, true, sortSelect.value);
		} else {
			sortTable(tableData, false, sortSelect.value);
		}
	});
}

function clearFilterData(tableData, filter){
	document.getElementById(filter).value = "";
	sessionStorage.setItem(filter, "");
	createFilterData(tableData);
}

window.addEventListener("load", function() {
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