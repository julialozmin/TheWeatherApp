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

function displayWeatherCondition(response) {
  document.querySelector("#cityEntered").innerHTML = response.data.city;
  document.querySelector("#degreesValue").innerHTML = `${Math.round(
    response.data.temperature.current
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

let searchbarField = document.querySelector("#search-form");
let clickSearchButton = document.querySelector("#searchButton");
let clickLocationButton = document.querySelector("#locationButton");

searchbarField.addEventListener("submit", handleSubmit);
clickSearchButton.addEventListener("click", handleSubmit);

clickLocationButton.addEventListener("click", locatedCity);

searchCity("Chieti");
