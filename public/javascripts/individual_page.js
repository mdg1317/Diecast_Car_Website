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
	var carArray = JSON.parse(sessionStorage.getItem("tableData"));
	var carData = carArray.find(o => o.id == location.search.substring(1));
	console.log(carData);
	fillPage(carData);
});