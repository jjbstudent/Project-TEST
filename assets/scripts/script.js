document.addEventListener('DOMContentLoaded', function () {
    var dropdown = document.querySelector('.dropdown');
    var dropdownButton = document.querySelector('.dropdown-toggle');
    var dropdownItems = document.querySelectorAll('.dropdown-item');
    var cityTownInput = document.getElementById('cityTownInput');

    // Default values or initial values
    var cityTown = "";  // Initial value is empty

    // Event listener for input change
    cityTownInput.addEventListener('input', function () {
        // Update the cityTown variable
        cityTown = cityTownInput.value;
    });

    dropdownItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var selectedCategory = item.getAttribute('data-category');
            dropdown.setAttribute('data-selected-category', selectedCategory);

            // Update the button text with the selected category
            dropdownButton.textContent = 'Select here - ' + selectedCategory;
        });
    });
});

function performSearch() {
    var selectedCategory = document.querySelector('.dropdown').getAttribute('data-selected-category');
    var cityTown = document.getElementById('cityTownInput').value;
    var errorMessageContainer = document.getElementById('error-message');

    // Validate input before making the fetch request
    if (cityTown.trim() !== "" && selectedCategory) {
        // Clear previous error message
        errorMessageContainer.textContent = "";

        fetchFromSerper(cityTown, selectedCategory);
    } else {
        // Display error message
        errorMessageContainer.textContent = 'Invalid input or category selection.';
        console.error('Invalid input or category selection.');
    }
}

function fetchFromSerper(cityTown, selectedCategory) {
    var serperAPI = "2813e1297564fcc84cf203c0dafe4e0e10c5ef05";
    var myHeaders = new Headers();
    myHeaders.append("X-API-KEY", serperAPI);
    myHeaders.append("Content-Type", "application/json");

    // Concatenate the cityTown variable and selected category without "bars"
    var raw = JSON.stringify({
        "q": cityTown + " " + selectedCategory,
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
            console.log('API Response:', result);
            appendRowsOfCardsToContainer(JSON.parse(result).places || []);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Handle the error, e.g., display an error message to the user
        });
}

function appendRowsOfCardsToContainer(places) {
    var restaurantList = document.getElementById("restaurant-list");

    try {
        // Clear existing content
        restaurantList.innerHTML = "";

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