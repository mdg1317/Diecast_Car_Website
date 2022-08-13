const loadTable = async () => {
	console.log("Attempting to access table...");
	$.post({
		url: "/tableData",
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
	var i,j;
	var currentRow;
	for(i = 0; i < 2; i++){
		currentRow = document.getElementById("row" + i);
		for(j = i * 5; j < (i + 1) * 5; j++){
			var newDiv = document.createElement("div");
			var newLink = document.createElement("a");
			var newImg = document.createElement("img");
			var newP = document.createElement("p");

			newDiv.setAttribute("class", "column");
			newLink.href = "individual_page.html?" + j;

			newImg.setAttribute("id", "image" + j);
			newImg.src = data[j].imageCar;
			newImg.setAttribute("alt", "No image available");

			newP.setAttribute("id", "result" + j);
			newP.innerHTML = data[j].number + " - " + data[j].driver;

			newLink.appendChild(newImg);
			newLink.appendChild(newP);
			newDiv.appendChild(newLink);
			currentRow.appendChild(newDiv);
		}
	}

}

function populateIndividual(data, carID){
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

loadTable();