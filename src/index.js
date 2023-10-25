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
  )}º`;
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
  console.log(response.data.city);
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

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#degreesValue");
  temperatureElement.innerHTML = `${fahrenheitTemperature}º`;
}
function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#degreesValue");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = `${Math.round(celsiusTemperature)}º`;
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div>`;
  let days = ["Thu", "Fri", "Sat", "Sun", "Mon"];
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `     
        <div class="weather-forecast" id="forecast">
        <span class="weather-forecast-day">${day}</span>
        <span class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-min">16</span>º-<span
            class="weather-forecast-temperature-max"
            >19</span
          >º
            <img
          src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/broken-clouds-day.png"
          alt=""
          width="42"
        />
        </div>
        `;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
