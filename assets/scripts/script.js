var serperAPI = "2813e1297564fcc84cf203c0dafe4e0e10c5ef05" //serper API
var restaurantList = [];

// Function to perform the search using the entered city/town
function performSearch() {
  // Get the value from the input field
  var cityTown = document.getElementById("cityTownInput").value;

  if (cityTown.trim() !== "") {
    // Clear existing content
    document.getElementById("restaurant-list").innerHTML = "";

    // Call the fetchFromSerper function with the entered city/town
    fetchFromSerper(cityTown);
  } else {
     // Update the input field with a message
     cityTownInput.value = "Please enter a city or town.";
  }
}
// Your existing fetchFromSerper function
function fetchFromSerper(cityTown) { 
  var myHeaders = new Headers();
  myHeaders.append("X-API-KEY", "2813e1297564fcc84cf203c0dafe4e0e10c5ef05");
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "q": "bars " + cityTown, // Concatenate the cityTown variable here
    "gl": "gb"
  });
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://google.serper.dev/places", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log('API Response:', result); // Log the response to the console
      appendRowsOfCardsToContainer(JSON.parse(result).places || []);
    })
    .catch(error => console.log('error', error));
}
function appendToSearchResults(result) {
  var searchResultsTextarea = document.getElementById("searchResults");

  try {
    // Parse the JSON response
    var data = JSON.parse(result);

    // Extract relevant information from places
    var places = data.places || [];

    // Call the function to append rows of cards to the textarea
    appendRowsOfCardsToContainer(places);
  } catch (error) {
    // Handle JSON parsing error
    console.error('Error parsing JSON:', error);
    searchResultsTextarea.textContent += "Error parsing JSON response\n";
  }
}
// Function to append rows of cards directly to the "restaurant-list" container
function appendRowsOfCardsToContainer(places) {
  var restaurantList = document.getElementById("restaurant-list");

  try {
    // Create a new row container
    var rowContainer = document.createElement("div");
    rowContainer.classList.add("row");

    places.forEach((place, index) => {
      // Create HTML elements for each place
      var restaurantCard = document.createElement("div");
      restaurantCard.classList.add("card", "col-md-2"); // Adjust the class as per your layout

      // Calculate new dimensions by reducing size by 2/3
      var newWidth = place.thumbnailWidth * (2 / 3);
      var newHeight = place.thumbnailHeight * (2 / 3);

      restaurantCard.innerHTML = `
        <img src="${place.thumbnailUrl}" alt="${place.title}" style="width: ${newWidth}px; height: ${newHeight}px;">
        <div class="card-body">
          <h5 class="card-title">${place.title}</h5>
          <p class="card-text">${place.address}</p>
          <p class="card-text">Rating: ${place.rating}</p>
          <p class="card-text">Category: ${place.category}</p>
        </div>
      `;

      // Append the card to the row container
      rowContainer.appendChild(restaurantCard);
    });

    // Append the entire row container to the "restaurant-list" container
    restaurantList.appendChild(rowContainer);
  } catch (error) {
    console.error('Error processing API response:', error);
    // Handle error appropriately, e.g., display an error message
  }
}






