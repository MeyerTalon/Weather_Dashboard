var APIKey = "4f500407c1b96e4d03821ff2280e8f0a";
var currentDate = dayjs().format('MM/DD/YY');

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

$(document).ready(function() {
    $("#city-input").val('San Diego')
    searchCityTemp();


    // $("#search-btn").click(searchCityTemp, function() {
    //     console.log('test');
    // });

    function searchCityTemp() {
        var currentWeatherData;
        var city = $("#city-input").val();
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
        fetch (queryURL) 
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                var currentTemp = convertTemp(data.main.temp).toFixed(2);
                var currentWind = data.wind.speed;
                var currentHumidity = data.main.humidity;
                console.log(currentTemp + '\n' + currentWind + '\n' + currentHumidity);
                $('#city-name').text(city + ' ' + currentDate);
                $('#current-weather-info').append('<li>Temperature (degrees Fahrenheit): ' + currentTemp + '</li>');
                $('#current-weather-info').append('<li>Wind Speed: ' + currentWind + ' mph</li>');
                $('#current-weather-info').append('<li>Humidity: ' + currentHumidity + '%</li>');
            })        
    }
});



// openweather returns temp in Kelvin
// farenheit = (K - 273.15) * 1.8 + 32