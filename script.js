let apiKey = '5e0bb15c869988930c847342fc2149c9'

document.getElementById("search-form").addEventListener("submit", function (evt) {
    evt.preventDefault()
    var cityName = $("[name='city-input']").val()
    getLatLon(cityName);
});

function getLatLon(cityName) {
    console.log(cityName);
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`)
        .then(function (response) {
            console.log(response);
            if (response.ok === false) {
                alert("API key not authorized");
                return;
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var lat = data[0].lat;
            var lon = data[0].lon;
            var city = data[0].name;
            getWeather(lat, lon, city);
            getFiveDay(lat, lon);
            saveCity(city);
        })
        .catch(function (error) {
            console.error("Problem Getting Location Data:", error);
        });
}

function getWeather(lat, lon, city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            var cardTitle = $("<h2>").text(city);
            var temp = $("<p>").text(`Temp: ${data.main.temp} F`);
            var humidity = $("<p>").text(`Humidity: ${data.main.humidity} %`);
            var windSpeed = $("<p>").text(`Wind Speed: ${data.wind.speed} MPH`);
            var currentDate = new Date(data.dt * 1000);
            var date = $("<p>").text(`Date: ${currentDate.toLocaleDateString()}`);
            $(".city-main").empty().append(cardTitle, temp, humidity, windSpeed, date);
        })
        .catch(error => {
            console.error("Problem Getting Weather Data:", error);
        });
}

function getFiveDay(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < 5; i++) {
                var fiveDay = data.list[i * 8];
                var fiveDayCard = $(`.container .row .col-md-2:nth-child(${i + 1}) .card-body`);
                fiveDayCard.empty();
                var fiveCardDate = $("<h4>").text(new Date(fiveDay.dt * 1000).toLocaleDateString());
                var fiveCardTemp = $("<p>").text(`Temp: ${fiveDay.main.temp} F`);
                var fiveCardHumidity = $("<p>").text(`Humidity: ${fiveDay.main.humidity} %`);
                var fiveCardWind = $("<p>").text(`Wind Speed: ${fiveDay.wind.speed}`);
                fiveDayCard.append(fiveCardDate, fiveCardTemp, fiveCardHumidity, fiveCardWind);
            }
        })
        .catch(error => {
            console.error("Problem Getting Weather Data:", error);
        });
}

// Save the city to local storage
function saveCity(city) {
    const savedArray = JSON.parse(localStorage.getItem("savedArray")) || [];
    savedArray.push(city);
    localStorage.setItem("savedArray", JSON.stringify(savedArray));
    renderButtons();
}

const textInput = document.querySelector(".form-control");
const saveButton = document.querySelector(".btn.btn-primary");
const buttonList = document.getElementById("input-list");

function renderButtons() {
    buttonList.innerHTML = "";

    const savedArray = JSON.parse(localStorage.getItem("savedArray")) || [];
    savedArray.forEach(function (text, index) {
        const button = document.createElement("button");
        button.textContent = text;
        buttonList.appendChild(button);

        button.addEventListener("click", function () {
            getLatLon(text); // Fetch weather data for the clicked city
        });
    });
}

saveButton.addEventListener("click", function () {
    const textValue = textInput.value.trim();

    if (textValue !== "") {
        saveCity(textValue);
        textInput.value = "";
    } else {
        alert("Please enter some text before saving.");
    }
});

renderButtons();