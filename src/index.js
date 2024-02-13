let currentDate = new Date();
const dateDisplay = document.querySelector("#date");
const hourDisplay = document.querySelector("#hour");

let celsiusTemperature = null;

const searchbarField = document.querySelector("#search-form");
const clickLocationButton = document.querySelector("#location-button");

function formatDate(date) {
  let year = date.getFullYear();

  const months = [
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

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentWeekDay = days[date.getDay()];

  return `${currentWeekDay}, ${currentMonth} ${currentDay}, ${year}`;
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
  const day = date.getDay();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  return days[day];
}

function getForecast(city) {
  const forecastKey = `o214a6c6f6d2f53a6749b30tbf45c1ef`;
  const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${forecastKey}&units=metric`;
  axios.get(forecastUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  celsiusTemperature = response.data.temperature.current;

  document.querySelector("#city-entered").innerHTML = response.data.city;
  document.querySelector("#degrees-value").innerHTML = `${Math.round(
    celsiusTemperature
  )}º<span class="degrees-c">C</span>`;
  document.querySelector("#description-value").innerHTML =
    response.data.condition.description;
  document.querySelector("#humidity-value").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind-value").innerHTML = Math.round(
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
  const apiKey = `o214a6c6f6d2f53a6749b30tbf45c1ef`;
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${citySearch}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let citySearch = document.querySelector("#enter-city").value;
  this.reset();
  searchCity(citySearch);
}

function locatedCity(event) {
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

function retrievePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  const apiKey = `o214a6c6f6d2f53a6749b30tbf45c1ef`;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

function displayForecast(response) {
  let forecastData = response.data.daily;
  const forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<ul class="forecast-items">`;
  forecastData.forEach(function (forecastDataDay, index) {
    if ((index > 0) & (index < 5)) {
      forecastHTML =
        forecastHTML +
        `     
        <li class="forecast" id="forecast">
               <span class="weather-forecast-day">${formatForecastDay(
                 forecastDataDay.time
               )}</span>
        <span class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-min">${Math.round(
            forecastDataDay.temperature.minimum
          )}</span>/<span
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
  forecastHTML = forecastHTML + `</ul>`;
  forecastElement.innerHTML = forecastHTML;

  document.querySelector(
    "#max-min-values"
  ).innerHTML = `<span class="temperature-min">${Math.round(
    forecastData[0].temperature.minimum
  )}</span>/${Math.round(forecastData[0].temperature.maximum)}º`;
}

dateDisplay.innerHTML = formatDate(currentDate);
hourDisplay.innerHTML = formatTime(currentDate);

searchbarField.addEventListener("submit", handleSubmit);
searchbarField.addEventListener("click", handleSubmit);
clickLocationButton.addEventListener("click", locatedCity);

locatedCity();
