
const apiKey = "c7b7de8cd19f422859452fdbc68cc417";
var cities = [];
cities.reverse();

function loadTheCities() {
  cities = JSON.parse(localStorage.getItem("cities")) || [];
}

function saveTheCities() {
  localStorage.setItem("cities", JSON.stringify(cities));
}
$(document).ready(function () {
    loadTheCities();
  if (cities[0]) {
    setCity(cities[cities.length - 1]);
  }

  displayCities();
  // City and Date
  $(".btn").on("click", function (event) {
    event.preventDefault();

    var input = $(".form-control");
    var city = input.val();
    if (!cities.includes(city)) {
      cities.push(city);
      saveTheCities();
    }
    displayCities();
    setCity(city);
  });
  
});

// Set city weather 
function setCity(city) {
  var realDate = moment().format("LL");
  var weatherMapURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey;

  //set API data

  $.ajax({ url: weatherMapURL, type: "GET" }).then(function (response) {
    //the label
    console.log(response);
    var cityLocation = response.weather[0].icon;
    var imageDescription=response.weather[0].description;

    var labelSrc = "https://openweathermap.org/img/wn/" + cityLocation + "@2x.png";
    var labelImage = $(`<img src="${labelSrc}"alt="${imageDescription}"/>`);
    // labelImage.attr("src", labelSrc);

    $(".current-city").text(response.name + " (" + realDate + ")");
    $(".current-city").append(labelImage);
    $("#TemperatureC").text("Tempeture : " + response.main.temp + " °F");
    $("#humidityC").text("Humidity : " + response.main.humidity + " %");
    $("#winShield").text("Wind Shiel Speed : " + response.wind.speed + " MPH");
    // Converts the temp to Kelvin
    var forecastTempeture = (response.main.TemperatureC - 273.15) * 1.8 + 32;
    $(".forecastTempeture").text("Temperature (Kelvin) " + forecastTempeture);
    getUltraViolet(response.coord.lat, response.coord.lon);
    forecast(city);
    $(".form-control").val("");
  });
}

//display cities
function displayCities() {
  var limit;

  if (cities.length < 10) {
    limit = cities.length;
  } else {
    limit = 10;
  }
  $("#cityViewed").html("");
  for (var c = 0; c < limit; c++) {
    var cityViewed = $("<div>");
    cityViewed.addClass("row custom-border-bottom").css({
      textAlign: "center",
      // borderBottom: "1px solid silver",
      height: "50px",
      lineHeight: "50px",
      paddingLeft: "40px",
    });
    cityViewed.html(cities[c]);
    $("#cityViewed").prepend(cityViewed);

    //OnClick event on each city
    cityViewed.attr("id", `${cities[c]}`);
    $(`#${cities[c]}`).on("click", function () {
      setCity($(this).text());
    });
  }
}

//set Ultra Violet
function getUltraViolet(lat, lon) {
  var ultravioletURL =
    "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" +
    apiKey +
    "&lat=" +
    lat +
    "&lon=" +
    lon +
    "&cnt=1";
  $.ajax({ url: ultravioletURL, type: "GET" }).then(function (response) {
    $("#ultraVioletC").text("UV-index : " + response[0].value);
  });
}

// 5 days forecast codes

function forecast(city) {
  var forecastURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    apiKey;

  $.ajax({ url: forecastURL, type: "GET" }).then(function (response) {
    var list = response.list;
    console.log(response);
    // for each iteration of our loop
    $("#forecast").html("");
    for (var i = 39; i >= 0; i = i - 8) {
      var temp = ((list[i].main.temp - 273.15) * 1.8 + 32).toFixed(2);
      var iconId = list[i].weather[0].icon;
      var humidity = list[i].main.humidity;
      var date = new Date(list[i].dt_txt);

      var day = date.getDate();
      var month = date.getMonth();
      var year = date.getFullYear();

      var formatedDate = `${month + 1}/${day}/${year}`;
      // Creating and storing a div tag
      var tab = $("<div>");
      tab.addClass("tab");
      var mylog = $("<div>");
      mylog.addClass("card");
      tab.append(mylog);

      // Creating a paragraph tag with the response item
      var upperTime = $("<p>").text(formatedDate);
      // set image tag

      var iconUrl = "https://openweathermap.org/img/wn/" + iconId + "@2x.png";

      var weatherImage = $("<img>");
      // Setting attribute for the image
      weatherImage.attr("src", iconUrl);

      var underTemp = $("<p>").text("Temp: " + temp + "°F");
      var underHumidity = $("<p>").text("Humidity: " + humidity + "%");

      // Appending the paragraph and image tag to mylog for the 5-Day Forecast
      mylog.append(upperTime);
      mylog.append(weatherImage);
      mylog.append(underTemp);
      mylog.append(underHumidity);

      // Prependng the tab to the HTML page in the "#forecast" div

      $("#forecast").prepend(tab);
    }
  });
}