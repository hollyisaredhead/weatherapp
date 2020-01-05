const apiKey = "c1be6b59e77dbb0904b3a46d76bb3fff";
var currentWeatherDiv = $("#currentWeather");
var frcstDiv = $("#weatherForecast");
var locationsArray;


if (localStorage.getItem("localWeatherStorage")) {
  locationsArray = JSON.parse(localStorage.getItem("localWeatherSearches"));
  writeSearchHistory(locationsArray)
} else {
  locationsArray = [];
};


function returnCurrentWeather(cityName) {
  let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${apiKey}`;

  $.get(queryURL).then(function (response) {
    let currTime = new Date(response.dt * 1000);
    let weatherIcon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;

    currentWeatherDiv.html(`
    <h2>${response.name}, ${response.sys.country} (${currTime.getMonth() + 1}/${currTime.getDate()}/${currTime.getFullYear()})<img src=${weatherIcon} height="70px"></h2>
    <p>Temperature: ${response.main.temp} &#176;C</p>
    <p>Humidity: ${response.main.humidity}%</p>
    <p>Wind Speed: ${response.wind.speed} m/s</p>
    `, returnUVIndex(response.coord))
    createHistoryButton(response.name);
  })
};

function returnWeatherForecast(cityName) {
  let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&APPID=${apiKey}`;

  $.get(queryURL).then(function (response) {
    let forecastInfo = response.list;
    frcstDiv.empty();
    $.each(forecastInfo, function (i) {
      if (!forecastInfo[i].dt_txt.includes("12:00:00")) {
        return;
      }
      let forecastDate = new Date(forecastInfo[i].dt * 1000);
      let weatherIcon = `https://openweathermap.org/img/wn/${forecastInfo[i].weather[0].icon}.png`;

      frcstDiv.append(`
      <div class="col-md">
          <div class="card text-white bg-primary">
              <div class="card-body">
                  <h4>${forecastDate.getMonth() + 1}/${forecastDate.getDate()}/${forecastDate.getFullYear()}</h4>
                  <img src=${weatherIcon} alt="Icon">
                  <p>Temp: ${forecastInfo[i].main.temp} &#176;C</p>
                  <p>Humidity: ${forecastInfo[i].main.humidity}%</p>
              </div>
          </div>
      </div>
      `)
    })
  })
};
function returnUVIndex(coordinates) {
  let queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${apiKey}`;

  $.get(queryURL).then(function (response) {
    let currUVIndex = response.value;
    let uvSeverity = "green";
    let textColor = "white";

    if (currUVIndex >= 11) {
      uvSeverity = "purple";
    }

    else if (currUVIndex >= 8) {
      uvSeverity = "orange";
      textColor = "black";
    }
    else if (currUVIndex >= 3) {
      uvSeverity = "yellow";
      textColor = "black";
    }

    currentWeatherDiv.append(`<p>UV Index: <span class="text-${textColor} uvPadding" style="background-color: ${uvSeverity};">${currUVIndex}</span></p>`);

  })
}

function createHistoryButton(cityName) {
  // Check if the button exists in history, and if it does, exit the function
  var citySearch = cityName.trim();
  var buttonCheck = $(`#previousSearch > BUTTON[value='${citySearch}']`);
  if (buttonCheck.length == 1) {
    return;
  }

  if (!locationsArray.includes(cityName)) {
    locationsArray.push(cityName);
    localStorage.setItem("localWeatherSearches", JSON.stringify(locationsArray));
  }

  $("#previousSearch").prepend(`
  <button class="btn btn-light cityHistoryBtn" value='${cityName}'>${cityName}</button>
  `);
}

function writeSearchHistory(array) {
  $.each(array, function (i) {
    createHistoryButton(array[i]);
  })
}

// Get a deafult weather search
returnCurrentWeather("Toronto");
returnWeatherForecast("Toronto");

$("#submitCity").click(function () {
  event.preventDefault();
  let cityName = $("#cityInput").val();
  returnCurrentWeather(cityName);
  returnWeatherForecast(cityName);
});

$("#previousSearch").click(function () {
  let cityName = event.target.value;
  returnCurrentWeather(cityName);
  returnWeatherForecast(cityName);
})
