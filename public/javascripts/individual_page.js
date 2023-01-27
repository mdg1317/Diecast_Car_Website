// Author: Matthew Groh
// Last Updated: 1/26/2023
//
// individual_page.js
//
// This script gets the corresponding car from the database and loads
// its info on the page

function fillPage(data){
	// Replace all sample data with data from SQL query
	document.getElementById("header").innerHTML = data.number + " - " + data.driver;
	document.getElementById("driver").innerHTML = data.driver;
	document.getElementById("number").innerHTML = data.number;
	document.getElementById("series").innerHTML = data.series;
	if(data.other == ""){
		document.getElementById("sponsor").innerHTML = data.sponsor;
	} else {
		document.getElementById("sponsor").innerHTML = data.sponsor + " - " + data.other;
	}
	document.getElementById("team").innerHTML = data.team;
	document.getElementById("manufacturer").innerHTML = data.manufacturer;
	document.getElementById("year").innerHTML = data.year;

	document.getElementById("image0").src = "images/" + data.image0;
	if(data.image0 != "NoImageAvailable.jpg"){
		document.getElementById("image0Link").href = "images/" + data.image0;
	}

	document.getElementById("image1").src = "images/" + data.image1;
	if(data.image1 != "NoImageAvailable.jpg"){
		document.getElementById("image1Link").href = "images/" + data.image1;
	}

	document.getElementById("imageCar").src = "images/" + data.imageCar;
	if(data.imageCar != "NoImageAvailable.jpg"){
		document.getElementById("imageCarLink").href = "images/" + data.imageCar;
	}

	document.getElementById("imageDriver").src = "images/" + data.imageDriver;
	if(data.imageDriver != "NoImageAvailable.jpg"){
		document.getElementById("imageDriverLink").href = "images/" + data.imageDriver;
	}
}

$(document).ready(function() {
	var carArray;

	// If a search was made, use that subset
	// If not, use whole array
	if(sessionStorage.getItem("filterData") != null){
		carArray = JSON.parse(sessionStorage.getItem("filterData"));
	} else {
		carArray = JSON.parse(sessionStorage.getItem("tableData"));
	}

	// Get specific entry that matches id
	var carData = carArray.find(o => o.id == location.search.substring(1));
	fillPage(carData);

	// Set correct page number for when using the back button after
	// using prev and next buttons
	var numInList = carArray.indexOf(carData);
	sessionStorage.setItem("pageNum", (Math.ceil((numInList + 1) / 50) - 1));

	// Save current car ID for when reloading main page
	sessionStorage.setItem("savedID", location.search.substring(1));

	var prevButton = document.getElementById("prevButton");
	var nextButton = document.getElementById("nextButton");

	// If at first or last entry, hide respective button
	var currentIndex = carArray.indexOf(carData);
	if(currentIndex + 1 >= carArray.length){
		nextButton.style.visibility = "hidden";
	} else {
		nextButton.href = "individual_page.html?" + carArray[currentIndex + 1].id;
	}

	if(currentIndex - 1 < 0){
		prevButton.style.visibility = "hidden";
	} else {
		prevButton.href = "individual_page.html?" + carArray[currentIndex - 1].id;
	}
});