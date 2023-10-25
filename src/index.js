function formatDate(date) {
  let year = date.getFullYear();

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let currentMonth = months[date.getMonth()];

  let currentDay = date.getDate();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentWeekDay = days[date.getDay()];

  return `${currentWeekDay}, ${currentDay}th ${currentMonth} ${year}`;
}

function formatTime(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  return days[day];
}

let dateDisplay = document.querySelector("#date");
let currentDate = new Date();

dateDisplay.innerHTML = formatDate(currentDate);

let hourDisplay = document.querySelector("#hour");
hourDisplay.innerHTML = formatTime(currentDate);

function getForecast(city) {
  let forecastKey = `o214a6c6f6d2f53a6749b30tbf45c1ef`;
  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${forecastKey}&units=metric`;
  axios.get(forecastUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  celsiusTemperature = response.data.temperature.current;

  document.querySelector("#cityEntered").innerHTML = response.data.city;
  document.querySelector("#degreesValue").innerHTML = `${Math.round(
    celsiusTemperature
  )}º<span class="degreesC">C</span>`;
  document.querySelector("#descriptionValue").innerHTML =
    response.data.condition.description;
  document.querySelector("#humidityValue").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#windValue").innerHTML = Math.round(
    3.6 * response.data.wind.speed
  );
  document
    .querySelector("#main-icon")
    .setAttribute("src", response.data.condition.icon_url);
  document
    .querySelector("#main-icon")
    .setAttribute("alt", response.data.condition.description);
  getForecast(response.data.city);
}

function searchCity(citySearch) {
  let apiKey = `o214a6c6f6d2f53a6749b30tbf45c1ef`;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${citySearch}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let citySearch = document.querySelector("#enterCity").value;
  searchCity(citySearch);
}

function locatedCity(event) {
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

function retrievePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = `o214a6c6f6d2f53a6749b30tbf45c1ef`;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

let celsiusTemperature = null;

let searchbarField = document.querySelector("#search-form");
let clickSearchButton = document.querySelector("#searchButton");
let clickLocationButton = document.querySelector("#locationButton");

searchbarField.addEventListener("submit", handleSubmit);
clickSearchButton.addEventListener("click", handleSubmit);

clickLocationButton.addEventListener("click", locatedCity);

searchCity("Chieti");

function displayForecast(response) {
  let forecastData = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div>`;
  forecastData.forEach(function (forecastDataDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `     
        <div class="weather-forecast" id="forecast">
        <span class="weather-forecast-day">${formatForecastDay(
          forecastDataDay.time
        )}</span>
        <span class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-min">${Math.round(
            forecastDataDay.temperature.minimum
          )}</span>-<span
            class="weather-forecast-temperature-max"
            >${Math.round(forecastDataDay.temperature.maximum)}º</span
          >      
            <img
          src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
            forecastDataDay.condition.icon
          }.png"
          alt="${forecastDataDay.condition.description}"
          width="42"
          id= "image"
        />
        `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;

  document.querySelector(
    "#max-min-values"
  ).innerHTML = `<span class="temperatureMin">${Math.round(
    forecastData[0].temperature.minimum
  )}</span>-${Math.round(forecastData[0].temperature.maximum)}º`;
}
