// Talon's Goofy Wacky Weatherboard ;)

// Initilize and declare global vars
var APIKey = "4f500407c1b96e4d03821ff2280e8f0a";
var currentDate = dayjs().format('MM/D/YY');
var currentDay = parseInt(dayjs().format('DD'));
var hour = parseInt(dayjs().format('H'));
var numCities = parseInt(localStorage.getItem('numCities'));

// Initilize global vars to be decalared later
var cityLat;
var cityLon;
var isDay;
var cities = [];
var isCity = true;

// Checks the time of day
if (hour >= 6 && hour < 18) {
    isDay = true;
} else {
    isDay = false;
}

// Converts given temp from Kelvin to Fahrenheit
function convertTemp(myTemp) {
    return ((myTemp -273.15 ) * 1.8) + 32;
}

// Checks the given weather condition and returns a matching icon
function checkConditions(myCondition) {
    if(myCondition === 'Clear') {
        if(isDay) {
            return "🔆";
        } else {
            return "🌙";
        }
    } else if(myCondition === 'Rain') {
        return "🌧";
    } else if(myCondition === 'Mist') {
        return "🌫"
    } else if(myCondition === 'Snow') {
        return "🌨";
    } else if (myCondition === 'Clouds') {
        return "☁";
    } else if (myCondition === 'Haze') {
        return "☁";
    }
}

// Makes sure document is fully loaded before executing
$(document).ready(function() {

    // Calls getSearchHistory() first
    getSearchHistory();

    // Set click events to searh and city btns
    $("#search-btn").click(searchCityTemp);
    $('.btn-secondary').click(searchCityTemp);

    
    // Sets the top white card to the current weather conditions of the city
    function searchCityTemp(event) {

        event.preventDefault();

        var city;

        if (event.target.textContent !== 'Search') {
            city = event.target.textContent;
        } else {
            city = $("#city-input").val();
        }

        var currentWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

        fetch (currentWeatherURL) 
            .then(function(response) {
                if (response.status === 404 || response.status === 400) {
                    isCity = false;
                    window.alert("City not found :( Please enter a valid city name.");
                } else {
                    isCity = true;
                }
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                var currentTemp = convertTemp(data.main.temp).toFixed(2);
                var currentWind = data.wind.speed;
                var currentHumidity = data.main.humidity;
                var currentConditions = checkConditions(data.weather[0].main);

                cityLat = data.coord.lat;
                cityLon = data.coord.lon;

                $('#city-name').text(city + ' ' + currentDate + ' ' + currentConditions);
                $('#current-weather-info').children('li').eq(0).text('Temperature: ' + currentTemp + ' \u00B0F');
                $('#current-weather-info').children('li').eq(1).text('Wind Speed: ' + currentWind + ' MPH');
                $('#current-weather-info').children('li').eq(2).text('Humidity: ' + currentHumidity + ' %');
                
            })
            .then(searchCityForecast)
            .then(setSearchHistory)
            .then(function() {
                $('.btn-secondary').off();
                $('.btn-secondary').click(searchCityTemp);
            })

    }

    // Sets the bottom blue cards the 5 day weather forecast
    function searchCityForecast() {

        var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey;

        fetch(forecastURL)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {

                var forecastDates = [];
                var forecastTemps = [];
                var forecastWinds = [];
                var forecastHumidities = [];
                var forecastConditions = [];

                for (var i = 3; i <= 35; i += 8) {
                    currentDay++;
                    forecastDates.push(dayjs('2022-01-' + currentDay).format('MM/DD/YY'));
                    forecastTemps.push(convertTemp(data.list[i].main.temp).toFixed(2));
                    forecastWinds.push(data.list[i].wind.speed);
                    forecastHumidities.push(data.list[i].main.humidity);
                    forecastConditions.push(checkConditions(data.list[i].weather[0].main));
                }

                for (var i = 0; i < 5; i++) {
                    $('#weather-forecast').children('.card').eq(i).children('.card-body').children('.card-title').text(forecastDates[i] + ' ' + forecastConditions[i]);
                    $('#weather-forecast').children('.card').eq(i).children('.card-body').children('ul').children('li').eq(0).text('Temperature: ' + forecastTemps[i] + ' \u00B0F');
                    $('#weather-forecast').children('.card').eq(i).children('.card-body').children('ul').children('li').eq(1).text('Wind Speed: ' + forecastWinds[i] + ' MPH');
                    $('#weather-forecast').children('.card').eq(i).children('.card-body').children('ul').children('li').eq(2).text('Humidity: ' + forecastHumidities[i] + ' %');
                }

                currentDay = parseInt(dayjs().format('DD'));
                forecastDates = [];
                forecastTemps = [];
                forecastWinds = [];
                forecastHumidities = [];
                forecastConditions = [];

            })
    }

    // Sets the city to local storage and creates the cities btn
    function setSearchHistory() {

        var city = $("#city-input").val();
        if (city === '') {
            isCity = false;
        }

        if (!isCity) {
            return;
        }

        if (cities.length === 0) {
            cities.push(city);
            $('#side-bar').append('<button class="btn btn-secondary p-2 m-1">' + city + '</button>');
        } else {
            for (var i = 0; i < cities.length; i++) {
                if (city === cities[i]) {
                    break;
                }
                if (i === cities.length - 1) {
                    cities.push(city);
                    $('#side-bar').append('<button class="btn btn-secondary p-2 m-1">' + city + '</button>');
                }
            }
        }

        for (var i = 0; i < cities.length; i++) {
            localStorage.setItem("city" + i, cities[i]);
        }
        localStorage.setItem("numCities", cities.length);

        $("#city-input").val('');
    }

    // Gets the cities from local storage and creates their btns
    function getSearchHistory() {
            for (var i = 0; i < numCities; i++) {
                cities[i] = localStorage.getItem('city' + i);
            }
            
            for (var i = 0; i < cities.length; i++) {
                $('#side-bar').append('<button class="btn btn-secondary p-2 m-1">' + cities[i] + '</button>');
            }
    }


});