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
  document.querySelector("#cityEntered").innerHTML = response.data.name;
  document.querySelector("#degreesValue").innerHTML = `${Math.round(
    response.data.main.temp
  )}º`;
  document.querySelector("#descriptionValue").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#humidityValue").innerHTML =
    response.data.main.humidity;
  document.querySelector("#windValue").innerHTML = Math.round(
    response.data.wind.speed
  );
  document
    .querySelector("#main-icon")
    .setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#main-icon")
    .setAttribute("alt", response.data.weather[0].main);
}

function searchCity(citySearch) {
  let apiKey = `72bb9dab46b9ec3d65f423c63f27a9b8`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=metric&appid=${apiKey}`;

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
  let apiKey = `72bb9dab46b9ec3d65f423c63f27a9b8`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

let searchbarField = document.querySelector("#search-form");
let clickSearchButton = document.querySelector("#searchButton");
let clickLocationButton = document.querySelector("#locationButton");

searchbarField.addEventListener("submit", handleSubmit);
clickSearchButton.addEventListener("click", handleSubmit);

clickLocationButton.addEventListener("click", locatedCity);

searchCity("Chieti");
