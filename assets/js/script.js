var weatherContainer = document.querySelector('#weather-container');
var weatherForm = document.querySelector('#weather-form');
var cityInput = document.querySelector('#city');

var valueOfForm = function (event) {
  event.preventDefault();
  var cityName = cityInput.value.trim();
  latLon(cityName);
}

var latLon = function (cityName) {
  console.log(cityName);
  var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=906a2e86d71a0fa20075bc84b30f3d37';

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
          if (data.length === 0) {
              weatherContainer.textContent = 'City not found.';
              return;
          } else {
              console.log(data);
              cityName = data[0].name;

              if (localStorage.getItem(cityName) == null) {
                localStorage.setItem(cityName, cityName);
                var cityButtons = $("#city-buttons");
                cityButtons.append(
                  "<button class=\"btn\" id=" + cityName + ">" + cityName + "</button>"
                );
              }

              var lat = data[0].lat;
              lat = lat.toFixed(2);
              var lon = data[0].lon;
              lon = lon.toFixed(2);
              console.log(lat);
              weatherData(cityName, lat, lon);
          }
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  });
};

var weatherData = function (cityName, lat, lon) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&exclude=minutely,hourly,alerts&appid=906a2e86d71a0fa20075bc84b30f3d37';
  console.log(apiUrl);
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
          if (data.length === 0) {
              weatherContainer.textContent = 'City not found.';
              return;
          } else {
              var fullDate = new Date()
              var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : '0' + (fullDate.getMonth()+1);
              var currentTime = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
              var temp = data[0].current.temp
              var wind = data[0].current.wind_speed;
              var humidity = data[0].current.humidity;
              var uvIndex = data[0].current.uvi;
              cityCard(cityName, currentTime, temp, wind, humidity, uvIndex);

              var daily = data[0].daily;
              forecast(daily, currentTime);
          }
      });
    } else {
      alert('Error: ' + response.statusText);
      var fullDate = new Date()
      var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : '0' + (fullDate.getMonth()+1);
      var currentTime = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
      var temp = "284.07";
      var wind = "6";
      var humidity = "62";
      var uvIndex = "0.89";
      cityCard(cityName, currentTime, temp, wind, humidity, uvIndex);
      var daily = "daily";
      forecast(daily, currentTime);
    }
  });
};

var cityCard = function(cityName, time, temp, wind, humidity, uv) {
  var cityHeader = cityName + " (" + time + ")";
  temp = "Temp: " + temp + "F";
  wind = "Wind: " + wind + " MPH";
  humidity = "Humidity: " + humidity + " %";
  $("#cityHeader").text(cityHeader);
  $("#temp").text(temp);
  $("#wind").text(wind);
  $("#humidity").text(humidity);
  $("#uvIndex").text("UV Index: ")
  $("#uvNumber").text(uv);
}

var forecast = function(daily, currentTime) {
  var cardRow = $("#cardRow");
  cardRow.empty();

  for (var i = 0; i < 5; i++) {
    var month = currentTime.substring(0, currentTime.indexOf("/") + 1);
    var year = currentTime.substring(currentTime.lastIndexOf("/"));
    var day = currentTime.substring(currentTime.indexOf("/") + 1, currentTime.lastIndexOf("/"));
    day = parseInt(day) + 1;
    day = day.toString();
    currentTime = month + day + year;

    // cardRow.append(
    //   "div class=\"col\">" +
    //     "<h2>" + currentTime + "</h2>"+
    //     "<p>" + daily[i].daily.temp + "</p>" +
    //     "<p>" + daily[i].daily.wind_speed + "</p>" +
    //     "<p>" + daily[i].daily.humidity + "</p>" +
    //   "</div>"
    // );
    cardRow.append(
      "<div class=\"col\">" +
        "<h2>Time</h2>"+
        "<p>wind</p>" +
        "<p>temp</p>" +
        "<p>humidity</p>" +
      "</div>"
    );
  }
}

function loadValue() {
  var cityButton = $("#city-buttons");
  console.log(localStorage);
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var nameOfCity = localStorage.getItem(key);
    cityButton.append(
      "<button class=\"btn\" id=" + nameOfCity + ">" + nameOfCity + "</button>"
    );
  }
}

weatherForm.addEventListener('submit', valueOfForm);

window.onload = function() {
  localStorage.clear();
  loadValue();
}

$(document).ready(function(){
  $("button").click(function() {
      console.log(this.id);
      latLon(this.id);
  });
});