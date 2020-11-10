
// Call this function when the page load
$(document).ready(function () {
    /* Target html tags elements */
    var savedCities = document.querySelector("#saved-cities");
    var cityName = document.querySelector("#city-name");
    var weatherDetails = document.querySelector("#weather-details");
    var forecastSection = document.querySelector("#forecast-section");

    // List of popular cities
    var citiesList = [
        "Ahmedabad",
        "Alexandria",
        "Atlanta",
        "Baghdad",
        "Bangalore",
        "Bangkok",
        "Barcelona",
        "Beijing",
        "Belo Horizonte",
        "Bogotá",
        "Buenos Aires",
        "Cairo",
        "Chengdu",
        "Chennai",
        "Chicago",
        "Chongqing",
        "Dalian",
        "Dallas",
        "Dar es Salaam",
        "Delhi",
        "Dhaka",
        "Dongguan",
        "Foshan",
        "Fukuoka",
        "Guadalajara",
        "Guangzhou",
        "Hangzhou",
        "Harbin",
        "Ho Chi Minh City",
        "Hong Kong",
        "Houston",
        "Hyderabad",
        "Istanbul",
        "Jakarta",
        "Jinan",
        "Johannesburg",
        "Karachi",
        "Khartoum",
        "Kinshasa",
        "Kolkata",
        "Kuala Lumpur",
        "Lagos",
        "Lahore",
        "Lima",
        "London",
        "Los Angeles",
        "Luanda",
        "Madrid",
        "Manila",
        "Mexico City",
        "Miami",
        "Moscow",
        "Mumbai",
        "Nagoya",
        "Nanjing",
        "New York City",
        "Osaka",
        "Paris",
        "Philadelphia",
        "Pune",
        "Qingdao",
        "Rio de Janeiro",
        "Riyadh",
        "Saint Petersburg",
        "Santiago",
        "São Paulo",
        "Seoul",
        "Shanghai",
        "Shenyang",
        "Shenzhen",
        "Singapore",
        "Surat",
        "Suzhou",
        "Tehran",
        "Tianjin",
        "Tokyo",
        "Toronto",
        "Washington, D.C.",
        "Wuhan",
        "Xi'an",
        "Yangon"
    ];

    var citiesChecked = []; /* Empty list that will storage the list of checked cities */

    /* If there is a list of search history saved on local storage */
    if (localStorage.getItem("searchHistory") !== null) {
        citiesChecked = JSON.parse(localStorage.getItem("searchHistory"));  /* Add searchHistory value to the citiesChecked list */
    }

    /* If there is record of last checked city on local storage */
    if (localStorage.getItem("lastCityChecked") !== null) {
        /* Update the searchbar text with saved lastCityChecked value */
        $("#search-input").val(localStorage.getItem("lastCityChecked"));
        setTimeout(function () {
            document.querySelector("#search-button").click();   /* Simulate a click on search button after 10 milliseconds */
        }, 10);
    }

    loadSearchHistory(); /* Call loadSearchHistory function */

    /* This function loop through the search history list and create list item on history area */
    function loadSearchHistory() {
        /* Loop through whole history list */
        for (var counter = citiesChecked.length - 1; counter >= 0; counter--) {
            var listItemEl = document.createElement("li");  /* Create a list item */
            listItemEl.classList.add("list-group-item");    /* Add class to list item */
            listItemEl.textContent = citiesChecked[counter];    /* Set the text  */
            savedCities.appendChild(listItemEl);    /* Add new list item to the UL element on the history area */
        }
    }

    /* This function generate a link possible cities name */
    function autoComplete() {
        var value = $(this).val();  /* Storage the searchbar value into a variable */
        document.getElementById('datalist').innerHTML = '';    /* Select and empty the value of the datalist element */

        /* loop through the list of citiesList */
        for (var counter = 0; counter < citiesList.length; counter++) {
            if (((citiesList[counter].toLowerCase()).indexOf(value.toLowerCase())) > -1) {  /* If input value is found on the citiesList */
                var option = document.createElement("option");  /* Create a option element */
                option.textContent = citiesList[counter];   /* Set the text value to be matching city on the list */
                document.getElementById("datalist").appendChild(option);    /* Add the new option element to the datalist tag */
            }
        }
    }

    /* This function fetch the weather of a particular city using openweather API */
    function getWeather() {
        /* Check if the searchbar is empty */
        if ($(this).siblings("#search-input").val() === "") {
            return; /* return and stop the function from keep executing */
        }

        /* Storage city name in searchbar in uppercase */
        var city = $(this).siblings("#search-input").val().toUpperCase();

        /* If searched city is not in the citiesChecked list */
        if (citiesChecked.indexOf(city) === -1) {

            citiesChecked.push(city);   /* Add new city name to the citiesChecked list */

            /* If citiesChecked length is higher than 8 */
            if (citiesChecked.length > 8) {
                savedCities.removeChild(savedCities.lastElementChild);  /* Remove the last li element on the savedCities ul */
                citiesChecked.shift();  /* Remove the first element on the citiesChecked to make citiesChecked's length = 8 */
            }

            var listItemEl2 = document.createElement("li"); /* Create a li element */
            listItemEl2.classList.add("list-group-item");   /* Add class to li element */
            listItemEl2.textContent = city; /* Set li text to be city name */
            $("#saved-cities").prepend(listItemEl2) /* Append new li element to the beginning of the ul */

            /* Save citiesChecked list to the local storage */
            localStorage.setItem("searchHistory", JSON.stringify(citiesChecked));
        }
        /* Save current checked city to local storage  */
        localStorage.setItem("lastCityChecked", city);

        // Clear Any previuos created HTML Elements on article tag
        $("#city-name").empty(); /* Empty div with #city-name */
        $("#weather-details").empty();  /* Empty div with #weather-details*/
        $("#forecast-section").empty(); /* Empty div with #forecast-section */

        var apiKey = "92f01d5cba187c445707d9cfcf61c726";    /* Openweather API Key */

        // Requeste URL for City Weather in metric units
        var requestUrlCurrentWeather = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=" + city + "&appid=" + apiKey;

        // Requeste URL for City Forecast in metric units
        var requestUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=" + city + "&appid=" + apiKey;
        
        // Fetch current weather
        fetch(requestUrlCurrentWeather)
            .then(function (response) {
                return response.json(); /* Pass response as json */
            })
            .then(function (data) {
                /* Create a object with weather properties from api response */
                var weatherObj = {
                    cityName: city,                     /* City name property */
                    datetime: data.dt,                  /* Datetime property */
                    timezone: data.timezone,            /* Timezone in seconds property */
                    weatherIcon: data.weather[0].icon,  /* Weather icon property */
                    temperature: data.main.temp,        /* Temperature property */
                    humidity: data.main.humidity,       /* Humidity property */
                    windSpeed: data.wind.speed,         /* Wind Speed property */
                    feesLike: data.main.feels_like,     /* Feels like property */
                    coordinate: data.coord,             /* City Coordinate property */
                }

                return weatherObj;  /* Return weatherObj */
            })
            .then(function (weatherDataObj) {
                getUVIndex(weatherDataObj, apiKey);  /* Call and pass weatherDataObj to getUVIndex function */
            })
            .catch(err => $("#alert-button").click())   /* Catch Error from if fetch failed */

        /* Fetch the forecast data from target city */
        fetch(requestUrlForecast)
            .then(function (response) {
                return response.json(); /* Return response value as json */
            })
            .then(function (data) {

                var forecastHeader = document.createElement("h2");  /* Create a new h2 element */
                forecastHeader.classList.add("col-12"); /* Add class to new h2 tag */
                forecastHeader.textContent = "Forecast";    /* Set h2 text to be Forecast */
                forecastSection.appendChild(forecastHeader);    /* Append new h2 to forecast section */

                var dayCounter = 86400; /* Number of seconds in a day */

                /* Loop through the response data (40 list) 8 interval at a time (8 cycle replace a full day) */
                for (var counter = 7; counter < data.list.length; counter += 8) {

                    var localDate = new Date();  // Create Date object for current location
                    var localTime = localDate.getTime(); // Convert to msec since Jan 1 1970
                    var localOffset = localDate.getTimezoneOffset() * 60000;  // Obtain local UTC offset and convert to msec
                    var utc = localTime + localOffset;  // Obtain UTC time in msec
                    var offset = data.city.timezone + dayCounter;   // Obtain destination's UTC time offset
                    var msecTargetLT = utc + (1000 * offset);  // Add destination's UTC time offset
                    var newCityDT = new Date(msecTargetLT).toLocaleDateString();  // Convert msec value to date string

                    dayCounter += 86400; // Increase dayCounter by 86400 seconds

                    var forecastWeatherIcon = data.list[counter].weather[0].icon;   /* Storage the weather icon code on variable */
                    var forecastTemp = data.list[counter].main.temp;    /* Storage weather temp on variable */
                    var forecastHumidity = data.list[counter].main.humidity;    /* Storage weather humidity on variable */

                    var forecastDiv = document.createElement("div");    /* Create div element */

                    var forecastIconEl = document.createElement("img"); /* Create img tag */
                    forecastIconEl.classList.add("card-img-top");   /* Add class to img tag */
                    forecastIconEl.src = "http://openweathermap.org/img/wn/" + forecastWeatherIcon + "@2x.png"; /* Set img src */

                    var detailsEl = document.createElement("div");  /* Create div element */

                    var dateForecastEl = document.createElement("h6");  /* Create h6 element */
                    dateForecastEl.id = "fc-title";     /* Add id of fc-title to h6 element */
                    dateForecastEl.textContent = newCityDT; /* Set text value of h6 element */

                    var tempForecastEl = document.createElement("p");   /* Create p element */
                    tempForecastEl.id = "fc-temperature";   /* Add id of fc-temperature to p element */
                    tempForecastEl.textContent = "Temp: " + forecastTemp + "\°C";   /* Set text value to the p element */

                    var humiForecastEl = document.createElement("p");   /* Create p element */
                    humiForecastEl.id = "fc-humidity";  /* Add id of fc-humidity to p element */
                    humiForecastEl.textContent = "Humidity: " + forecastHumidity + "%"; /* Set text value to the p element */

                    detailsEl.appendChild(dateForecastEl);  /* Append dateForecastEl to detailsEl */
                    detailsEl.appendChild(tempForecastEl);  /* Append tempForecastEl to detailsEl */
                    detailsEl.appendChild(humiForecastEl);  /* Append humiForecastEl to detailsEl */

                    forecastDiv.appendChild(forecastIconEl);    /* Append forecastIconEl to forecastDiv */
                    forecastDiv.appendChild(detailsEl);         /* Append detailsEl to forecastDiv */

                    forecastSection.appendChild(forecastDiv);   /* Append forecastDiv to forecastSection */
                }
            })
    }

    /* This function gets the UV index based on longitude and latitude coordinates */
    function getUVIndex(cityWeather, apiKey) {

        /* Fetch UV Index from Open Weather API in metric units */
        fetch("https://api.openweathermap.org/data/2.5/uvi?units=metric&lat=" + cityWeather.coordinate.lat + "&lon=" + cityWeather.coordinate.lon + "&appid=" + apiKey)
            .then(function (response) {
                return response.json(); /* Return response in json */
            })
            .then(function (data) {
                var localDate = new Date();  // Create Date object for current location
                var localTime = localDate.getTime(); // Convert to msec since Jan 1 1970
                var localOffset = localDate.getTimezoneOffset() * 60000;  // Obtain local UTC offset and convert to msec
                var utc = localTime + localOffset;  // Obtain UTC time in msec
                var offset = cityWeather.timezone;   // Obtain destination's UTC time offset
                var msecTargetLT = utc + (1000 * offset);  // add destination's UTC time offset
                var newCityDT = new Date(msecTargetLT).toDateString();  // Convert msec value to date string

                var cityNameEl = document.createElement("h2");  /* Create h2 element */
                cityNameEl.textContent = cityWeather.cityName;  /* Set text value for h2 element */
                var dateEl = document.createElement("h4");  /* Create h4 element */
                dateEl.textContent = " (" + newCityDT + ") ";   /* Set text value for h4 element */

                var weatherIconEl = document.createElement("img");  /* Create img element */
                weatherIconEl.src = "http://openweathermap.org/img/wn/" + cityWeather.weatherIcon + "@4x.png";  /* Set src value for img element */

                cityName.appendChild(cityNameEl);   /* Append cityNameEl to cityName div */
                cityName.appendChild(dateEl);   /* Append dateEl to cityName div */
                cityName.appendChild(weatherIconEl);    /* Append weatherIconEl to cityName div */

                var tempEl = document.createElement("h5");                                  /* Create h5 element */
                tempEl.id = "temperature";                                                  /* Add id of temperature to h5 element */
                tempEl.textContent = "Temperature: " + cityWeather.temperature + "\°C";     /* Set text value for h5 element */
                var humidityEl = document.createElement("h5");                              /* Create h5 element */
                humidityEl.id = "humidity";                                                 /* Add id of humidity to h5 element */
                humidityEl.textContent = "Humidity: " + cityWeather.humidity + "%";         /* Set text value for h5 element */
                var windSpeedEl = document.createElement("h5");                             /* Create h5 element */
                windSpeedEl.id = "wind-speed";                                              /* Add id of wind-speed to h5 element */
                windSpeedEl.textContent = "Wind Speed: " + cityWeather.windSpeed + " MPH";  /* Set text value for h5 element */
                var feelsLikeEl = document.createElement("h5");                             /* Create h5 element */
                feelsLikeEl.id = "feels-like";                                              /* Add id of feels-like to h5 element */
                feelsLikeEl.textContent = "Feels Like: " + cityWeather.feesLike + "\°C";    /* Set text value for h5 element */
                var uvIndexEl = document.createElement("h5");                               /* Create h5 element */
                uvIndexEl.id = "uv-index";                                                  /* Add id of uv-index to h5 element */
                uvIndexEl.textContent = "UV Index: " + data.value;                          /* Set text value for h5 element */

                weatherDetails.appendChild(tempEl);         /* Append tempEl to weatherDetails */
                weatherDetails.appendChild(humidityEl);     /* Append humidityEl to weatherDetails */
                weatherDetails.appendChild(windSpeedEl);    /* Append windSpeedEl to weatherDetails */
                weatherDetails.appendChild(feelsLikeEl);    /* Append feelsLikeEl to weatherDetails */
                weatherDetails.appendChild(uvIndexEl);      /* Append uvIndexEl to weatherDetails */
            })
    }

    /* This function simulate press of search button */
    function triggerSearchButtonPress() {
        var newInput = $(this).text();      /* Storage text value of clicked li on history section */
        $("#search-input").val(newInput);   /* Set Searchbar text value to be same at clicked li text */
        $("#search-button").click();        /* Click on Search button */
    }

    /* Event Listening */
    $("#search-input").on("keyup", autoComplete);   /* Call autoComplete when searchbar input change */
    $("#search-button").on("click", getWeather);    /* Call getWeather when search button is pressed */
    $(document).on('click', '.list-group-item', triggerSearchButtonPress);  /* Call triggerSearchButtonPress when .list-group-item is clicked */
})
