// var userFormEl = document.querySelector('#user-form');
// var cityButtons = document.querySelector('#city-buttons');
// var cityInput = document.querySelector('#city');
// var weatherContainer = document.querySelector('#weather-container');
// var repoSearchTerm = document.querySelector('#repo-search-term');

// // this is a function expression
// var formSubmitHandler = function (event) {
//   // this keeps the data there for when the page is refreshed
//   event.preventDefault();

//   var username = nameInputEl.value.trim();

//   if (username) {
//     getUserRepos(username);

//     repoContainerEl.textContent = '';
//     nameInputEl.value = '';
//   } else {
//     alert('Please enter a GitHub username');
//   }
// };

// var buttonClickHandler = function (event) {
//   var language = event.target.getAttribute('data-language');

//   if (language) {
//     getFeaturedRepos(language);

//     repoContainerEl.textContent = '';
//   }
// };

// var getUserRepos = function (user) {
//   var apiUrl = 'https://api.github.com/users/' + user + '/repos';

//   fetch(apiUrl)
//     .then(function (response) {
//       if (response.ok) {
//         console.log(response);
//         response.json().then(function (data) {
//           console.log(data);
//           displayRepos(data, user);
//         });
//       } else {
//         alert('Error: ' + response.statusText);
//       }
//     })
//     .catch(function (error) {
//       alert('Unable to connect to GitHub');
//     });
// };

// var getFeaturedRepos = function (language) {
//   var apiUrl = 'https://api.github.com/search/repositories?q=' + language + '+is:featured&sort=help-wanted-issues';

//   fetch(apiUrl).then(function (response) {
//     if (response.ok) {
//       response.json().then(function (data) {
//         displayRepos(data.items, language);
//       });
//     } else {
//       alert('Error: ' + response.statusText);
//     }
//   });
// };

// var displayRepos = function (repos, searchTerm) {
//   if (repos.length === 0) {
//     repoContainerEl.textContent = 'No repositories found.';
//     return;
//   }

//   repoSearchTerm.textContent = searchTerm;

//   for (var i = 0; i < repos.length; i++) {
//     var repoName = repos[i].owner.login + '/' + repos[i].name;

//     var repoEl = document.createElement('a');
//     repoEl.classList = 'list-item flex-row justify-space-between align-center';
//     repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

//     var titleEl = document.createElement('span');
//     titleEl.textContent = repoName;

//     repoEl.appendChild(titleEl);

//     var statusEl = document.createElement('span');
//     statusEl.classList = 'flex-row align-center';

//     if (repos[i].open_issues_count > 0) {
//       statusEl.innerHTML =
//         "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
//     } else {
//       statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
//     }

//     repoEl.appendChild(statusEl);

//     repoContainerEl.appendChild(repoEl);
//   }
// };

// userFormEl.addEventListener('submit', formSubmitHandler);
// languageButtonsEl.addEventListener('click', buttonClickHandler);











var weatherContainer = document.querySelector('#weather-container');
var weatherForm = document.querySelector('#weather-form');
var cityInput = document.querySelector('#city');

var latLon = function (event) {
    event.preventDefault();

    var cityName = cityInput.value.trim();
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=906a2e86d71a0fa20075bc84b30f3d37';

    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
            if (data.length === 0) {
                weatherContainer.textContent = 'City not found.';
                return;
            } else {
                cityName = data[0].name;
                var lat = data[0].lat;
                lat = lat.toFixed(2);
                var lon = data[0].lon;
                lon = lon.toFixed(2);

                weatherData(cityName, lat, lon);
            }
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    });
};

var weatherData = function (cityName, lat, lon) {
    console.log(lat);
    console.log(lon);
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&exclude=minutely,hourly,alerts&appid=9183060bbc0174b45453d35c12bc558d';
    console.log(apiUrl);
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        console.log(response);
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
      }
    });
};

var cityCard = function(cityName, time, temp, wind, humidity, uv) {

  var cityHeader = cityName + " (" + time + ")";
  temp = "Temp: " + temp + "F";
  wind = "Wind: " + wind + " MPH";
  humidity = "Humidity: " + humidity + " %";
  console.log(cityHeader);
  $("#cityHeader").text(cityHeader);
  $("#temp").text(temp);
  $("#wind").text(wind);
  $("#humidity").text(humidity);
  $("#uvIndex").text("UV Index: ")
  $("#uvNumber").text(uv);
}

var forecast = function(daily, currentTime) {
  var forecastCard = $("#forecast");
  for (var i = 0; i < 5; i++) {
    // append function to append the cards to the page for the 5 day forecast into the future
    // each time we loop we have to get a substring between the index of the first / and the second / to get the day
    // then increment the value  by one - function that turns a string into an integer + 1 then turn it back into a sting
    // then insert the value back into the main string

    // for each card we have to get the daily at the i index then get the icon, temp, wind, humidity
    // figure how to make columns for the cards to line up together
    // then have to append each value to the initial card

    // lastly have to figure out how to save the data of the users input into the buttons under the search button
  }
}





  weatherForm.addEventListener('submit', latLon);