// Author: Matthew Groh
// Last Updated: 8/16/2022
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
	document.getElementById("sponsor").innerHTML = data.sponsor;
	document.getElementById("manufacturer").innerHTML = data.manufacturer;
	document.getElementById("year").innerHTML = data.year;
	document.getElementById("image0").src = "images/" + data.image0;
	document.getElementById("image1").src = "images/" + data.image1;
	document.getElementById("imageCar").src = "images/" + data.imageCar;
	document.getElementById("imageDriver").src = "images/" + data.imageDriver;
}

$(document).ready(function() {
	var carArray;

	// If a search was made, use that subset
	// If not, use whole array
	if(sessionStorage.getItem("searchData") != null){
		console.log("searchData exists");
		carArray = JSON.parse(sessionStorage.getItem("searchData"));
	} else {
		console.log("searchData does not exist");
		carArray = JSON.parse(sessionStorage.getItem("tableData"));
	}

	// Get specific entry that matches id
	var carData = carArray.find(o => o.id == location.search.substring(1));
	console.log(carData);
	console.log(carArray.indexOf(carData));
	fillPage(carData);

	var prevButton = document.getElementById("prevButton");
	var nextButton = document.getElementById("nextButton");

	// If at first or last entry, hide respective button
	var currentIndex = carArray.indexOf(carData);
	if(currentIndex + 1 >= carArray.length){
		nextButton.setAttribute("hidden", true);
	} else {
		nextButton.href = "individual_page.html?" + carArray[currentIndex + 1].id;
	}

	if(currentIndex - 1 < 0){
		prevButton.setAttribute("hidden", true);
	} else {
		prevButton.href = "individual_page.html?" + carArray[currentIndex - 1].id;
	}
});