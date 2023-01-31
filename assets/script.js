var APIKey = "4f500407c1b96e4d03821ff2280e8f0a";
var currentDate = dayjs().format('MM/DD/YY');
var hour = parseInt(dayjs().format('H'));
var isDay;
var cityLat;
var cityLon;
if (hour >= 6 && hour < 18) {
    isDay = true;
} else {
    isDay = false;
}

// var city = 'San Diego';
// var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
// console.log(queryURL)
// fetch (queryURL) 
//     .then(function(response) {
//         return response.json();
//     })
//     .then(function(data) {
//         console.log(data);
//     })

function convertTemp(myTemp) {
    return ((myTemp -273.15 ) * 1.8) + 32;
}

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
    }
}

$(document).ready(function() {
    // $("#city-input").val('San Diego')
    // searchCityTemp();


    $("#search-btn").click(searchCityTemp);

    function searchCityTemp(event) {
        event.preventDefault();
        var city = $("#city-input").val();
        var currentWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
        fetch (currentWeatherURL) 
            .then(function(response) {
                if (response.status === 404 || response.status === 400) {
                    window.alert("City not found :( Please enter a valid city name.");
                }
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                var currentTemp = convertTemp(data.main.temp).toFixed(2);
                var currentWind = data.wind.speed;
                var currentHumidity = data.main.humidity;
                var currentConditions = data.weather[0].main;
                var conditionIconCode = checkConditions(currentConditions);
                cityLat = data.coord.lat;
                cityLon = data.coord.lon;
                console.log(cityLat + ' ' + cityLon)
                console.log(currentTemp + '\n' + currentWind + '\n' + currentHumidity + '\n' + currentConditions + '\n' + conditionIconCode);
                $('#city-name').text(city + ' ' + currentDate + ' ' + conditionIconCode);
                $('#current-weather-info').children('li').eq(0).text('Temperature: ' + currentTemp + ' \u00B0F');
                $('#current-weather-info').children('li').eq(1).text('Wind Speed: ' + currentWind + ' MPH');
                $('#current-weather-info').children('li').eq(2).text('Humidity: ' + currentHumidity + ' %');
                
            })
            .then(searchCityForecast)
    }

    function searchCityForecast() {
        var city = $("#city-input").val();
        var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey;
        fetch(forecastURL)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
            })
    }
});



// openweather returns temp in Kelvin
// farenheit = (K - 273.15) * 1.8 + 32