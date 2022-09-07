var weatherContainer = document.querySelector("#weather-container");
var weatherForm = document.querySelector("#weather-form");
var cityInput = document.querySelector("#city");

var valueOfForm = function (event) {
  event.preventDefault();
  var cityName = cityInput.value.trim();
  latLon(cityName);
}

var latLon = function (cityName) {
  console.log(cityName);
  var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=906a2e86d71a0fa20075bc84b30f3d37";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
          if (data.length === 0) {
            alert("City not found!");
            return;
          } else {
              console.log(data);
              cityName = data.city.name;
              if (localStorage.getItem(cityName.replaceAll(" ", "")) == null) {
                var cityNameKey = cityName.replaceAll(" ", "");
                console.log(cityNameKey);
                localStorage.setItem(cityNameKey, cityName);
                var cityButtons = $("#city-buttons");
                cityButtons.append(
                  "<button class=\"btn\" id=" + cityNameKey + ">" + cityName + "</button>"
                );
              }

              var lat = data.city.coord.lat;
              lat = lat.toFixed(2);
              var lon = data.city.coord.lon;
              lon = lon.toFixed(2);
              console.log(cityName);
              console.log(lat);
              console.log(lon);
              weatherData(cityName, lat, lon);
          }
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};

var weatherData = function (cityName, lat, lon) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&cnt=6&lat=" + lat + "&lon=" + lon + "&appid=906a2e86d71a0fa20075bc84b30f3d37";
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
          if (data.length === 0) {
            alert("City not found!");
            return;
          } else {
            console.log(data);
              var fullDate = new Date()
              var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : "0" + (fullDate.getMonth()+1);
              var currentTime = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
              var temp = data.list[0].main.temp;
              var wind = data.list[0].wind.speed;
              var humidity = data.list[0].main.humidity;
              var uvIndex = data.list[0].main.temp_kf;
              var icon = data.list[0].weather[0].icon;
              $("#weather-container").show();

              cityCard(cityName, currentTime, temp, wind, humidity, uvIndex, icon);
              forecast(data, currentTime);
          }
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};

var cityCard = function(cityName, time, temp, wind, humidity, uv, icon) {
  var cityHeader = cityName + " (" + time + ")" ;
  temp = "Temp: " + temp + "F";
  wind = "Wind: " + wind + " MPH";
  humidity = "Humidity: " + humidity + " %";
  $("#cityHeader").text(cityHeader);
  $("#temp").text(temp);
  $("#wind").text(wind);
  $("#humidity").text(humidity);
  $("#uvIndex").text("UV Index: ");
  $("#uvNumber").text(Math.abs(uv));
  if (uv < 2) {
    $("#uvNumber").attr("class", "favorable");
  } else if (uv < 5) {
    $("#uvNumber").attr("class", "moderate");
  } else {
    $("#uvNumber").attr("class", "severe");
  }
  $("#weather-icon").attr("src", "http://openweathermap.org/img/wn/" + icon + ".png");
}

var forecast = function(data, currentTime) {
  var cardRow = $("#cardRow");
  cardRow.empty();

  for (var i = 1; i < 6; i++) {
    var month = currentTime.substring(0, currentTime.indexOf("/") + 1);
    var year = currentTime.substring(currentTime.lastIndexOf("/"));
    var day = currentTime.substring(currentTime.indexOf("/") + 1, currentTime.lastIndexOf("/"));
    day = parseInt(day) + 1;
    day = day.toString();
    currentTime = month + day + year;

    cardRow.append(
      "<div class=\"col\">" +
        "<h4>" + currentTime + "</h4>" +
        "<img src=\"http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png\"/>" +
        "<p>Temp: " + data.list[i].main.temp + "F</p>" +
        "<p>Wind: " + data.list[i].wind.speed + " MPH</p>" +
        "<p>Humidity: " + data.list[i].main.humidity + " %</p>" +
      "</div>"
    );
    $("#weather-container-cards").show();
  }
}

function loadValue() {
  var cityButton = $("#city-buttons");
  console.log(localStorage);
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var nameOfCity = localStorage.getItem(key);
    var cityNameKey = nameOfCity.replaceAll(" ", "");
    cityButton.append(
      "<button class=\"btn\" id=" + cityNameKey + ">" + nameOfCity + "</button>"
    );
  }
}

weatherForm.addEventListener("submit", valueOfForm);

window.onload = function() {
  //localStorage.clear();
  loadValue();
  $("#weather-container").hide();
  $("#weather-container-cards").hide();
}

$(document).ready(function(){
  $("button").click(function() {
    if (this.id != "searchBtn") {
      var nameOfCity = localStorage.getItem(this.id);
      latLon(nameOfCity);
    }
  });
});