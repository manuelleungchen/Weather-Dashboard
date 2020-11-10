

$(document).ready(function () {

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

    // var currentCity;
    var citiesChecked = [];



    if (localStorage.getItem("searchHistory") !== null) {
        citiesChecked = JSON.parse(localStorage.getItem("searchHistory"));
    }

    if (localStorage.getItem("lastCiyChecked") !== null) {

        $("#search-input").val(localStorage.getItem("lastCiyChecked"));
        setTimeout(function () {
            document.querySelector("#search-button").click();
        }, 10);

    }

    loadSearchHistory();


    function loadSearchHistory() {

            for (var counter = citiesChecked.length -1; counter >= 0; counter--) {
            var listItemEl = document.createElement("li");
            listItemEl.classList.add("list-group-item");
            listItemEl.textContent = citiesChecked[counter];
            savedCities.appendChild(listItemEl);
        }
    }

    function autoComplete() {
        var value = $(this).val();
        document.getElementById('datalist').innerHTML = '';

        for (var counter = 0; counter < citiesList.length; counter++) {
            if (((citiesList[counter].toLowerCase()).indexOf(value.toLowerCase())) > -1) {
                var option = document.createElement("option");
                option.textContent = citiesList[counter];

                document.getElementById("datalist").appendChild(option);
            }
        }
    }

    function getWeather() {
        if ($(this).siblings("#search-input").val() === "" )
        {
            return;
        }
        var city = $(this).siblings("#search-input").val().toUpperCase();
        // Update current and history on local storage
        if (citiesChecked.indexOf(city) === -1) {

            citiesChecked.push(city);

            if (citiesChecked.length > 8) {
                savedCities.removeChild(savedCities.lastElementChild);
                citiesChecked.shift();

            }

            var listItemEl2 = document.createElement("li");
            listItemEl2.classList.add("list-group-item");
            listItemEl2.textContent = city;
            $("#saved-cities").prepend(listItemEl2)
            
            localStorage.setItem("searchHistory", JSON.stringify(citiesChecked));

        }
        localStorage.setItem("lastCiyChecked", city);

    
        // Clear Any previuos created HTML Elements

        $("#city-name").empty();
        $("#weather-details").empty();
        $("#forecast-section").empty();

        var apiKey = "92f01d5cba187c445707d9cfcf61c726";

        // Requeste URL for City Weather units=metric

        var requestUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=" + city + "&appid=" + apiKey;

        // Requeste URL for City Forecast
        var requestUrl2 = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=" + city + "&appid=" + apiKey;
        // Fetch current weather
        fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {

                var weatherObj = {
                    cityName: city,
                    datetime: data.dt,
                    timezone: data.timezone,
                    weatherIcon: data.weather[0].icon,
                    temperature: data.main.temp,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    feesLike: data.main.feels_like,
                    coordinate: data.coord,
                }

                return weatherObj;
            })
            .then(function (coord) {
                getUVIndex(coord, apiKey);
            })
        .catch(err => $("#alert-button").click())

        // Get forecast
        // Notes there are 40 arrays each with data for every 3 hours.
        // To get on the data for each day we need to increase by 8 

        fetch(requestUrl2)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {

                var forecastHeader = document.createElement("h2");
                forecastHeader.classList.add("col-12");
                forecastHeader.textContent = "Forecast";
                forecastSection.appendChild(forecastHeader);


                var dayCounter = 86400;
                for (var counter = 7; counter < data.list.length; counter += 8) {


                    var localDate = new Date();  // create Date object for current location
                    var localTime = localDate.getTime(); // convert to msec since Jan 1 1970
                    var localOffset = localDate.getTimezoneOffset() * 60000;  // obtain local UTC offset and convert to msec
                    var utc = localTime + localOffset;  // obtain UTC time in msec
                    var offset = data.city.timezone + dayCounter;   // obtain destination's UTC time offset
                    var msecTargetLT = utc + (1000 * offset);  // add destination's UTC time offset
                    var newCityDT = new Date(msecTargetLT).toLocaleDateString();  // convert msec value to date string


                    dayCounter += 86400; // Increase dayCounter by 86400 seconds

                    var forecastWeatherIcon = data.list[counter].weather[0].icon;
                    var forecastTemp = data.list[counter].main.temp;
                    var forecastHumidity = data.list[counter].main.humidity;


                    var forecastDiv = document.createElement("div");

                    var forecastIconEl = document.createElement("img");
                    forecastIconEl.classList.add("card-img-top");
                    forecastIconEl.src = "http://openweathermap.org/img/wn/" + forecastWeatherIcon + "@2x.png";

                    var detailsEl = document.createElement("div");

                    var dateForecastEl = document.createElement("h6");
                    dateForecastEl.id = "fc-title";
                    dateForecastEl.textContent = newCityDT;

                    var tempForecastEl = document.createElement("p");
                    tempForecastEl.id = "fc-temperature";
                    tempForecastEl.textContent = "Temp: " + forecastTemp + "\°C";

                    var humiForecastEl = document.createElement("p");
                    humiForecastEl.id = "fc-humidity";
                    humiForecastEl.textContent = "Humidity: " + forecastHumidity + "%";

                    detailsEl.appendChild(dateForecastEl);
                    detailsEl.appendChild(tempForecastEl);
                    detailsEl.appendChild(humiForecastEl);

                    forecastDiv.appendChild(forecastIconEl);
                    forecastDiv.appendChild(detailsEl);

                    forecastSection.appendChild(forecastDiv);

                }
            })
    }

    function getUVIndex(cityWeather, apiKey) {

        // Requeste URL for City UV Index
        fetch("http://api.openweathermap.org/data/2.5/uvi?units=metric&lat=" + cityWeather.coordinate.lat + "&lon=" + cityWeather.coordinate.lon + "&appid=" + apiKey)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {

                var localDate = new Date();  // create Date object for current location
                var localTime = localDate.getTime(); // convert to msec since Jan 1 1970
                var localOffset = localDate.getTimezoneOffset() * 60000;  // obtain local UTC offset and convert to msec
                var utc = localTime + localOffset;  // obtain UTC time in msec
                var offset = cityWeather.timezone;   // obtain destination's UTC time offset
                var msecTargetLT = utc + (1000 * offset);  // add destination's UTC time offset
                var newCityDT = new Date(msecTargetLT).toDateString();  // convert msec value to date string

                var cityNameEl = document.createElement("h2");
                cityNameEl.textContent = cityWeather.cityName;
                var dateEl = document.createElement("h4");
                dateEl.textContent = " (" + newCityDT + ") ";

                var weatherIconEl = document.createElement("img");
                weatherIconEl.src = "http://openweathermap.org/img/wn/" + cityWeather.weatherIcon + "@4x.png";

                cityName.appendChild(cityNameEl);
                cityName.appendChild(dateEl);
                cityName.appendChild(weatherIconEl);

                var tempEl = document.createElement("h5");
                tempEl.id = "temperature";
                tempEl.textContent = "Temperature: " + cityWeather.temperature + "\°C";
                var humidityEl = document.createElement("h5");
                humidityEl.id = "humidity";
                humidityEl.textContent = "Humidity: " + cityWeather.humidity + "%";
                var windSpeedEl = document.createElement("h5");
                windSpeedEl.id = "wind-speed";
                windSpeedEl.textContent = "Wind Speed: " + cityWeather.windSpeed + " MPH";
                var feelsLikeEl = document.createElement("h5");
                feelsLikeEl.id = "feels-like";
                feelsLikeEl.textContent = "Feels Like: " + cityWeather.feesLike + "\°C";
                var uvIndexEl = document.createElement("h5");
                uvIndexEl.id = "uv-index";
                uvIndexEl.textContent = "UV Index: " + data.value;

                weatherDetails.appendChild(tempEl);
                weatherDetails.appendChild(humidityEl);
                weatherDetails.appendChild(windSpeedEl);
                weatherDetails.appendChild(feelsLikeEl);
                weatherDetails.appendChild(uvIndexEl);
            })
    }

    function triggerSearchButtonPress() {

        var newInput = $(this).text();
        $("#search-input").val(newInput);
        $("#search-button").click();
        
    }


    $("#search-input").on("keyup", autoComplete);
    $("#search-button").on("click", getWeather);
    $(document).on('click','.list-group-item', triggerSearchButtonPress);

})
