var APIKey = "4f500407c1b96e4d03821ff2280e8f0a";
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

$(document).ready(function() {
    $("#city-input").val('San Diego')
    searchCityTemp();

    $("#search-btn").click(searchCityTemp, function() {
        console.log('test');
    });

    function searchCityTemp() {
        var city = $("#city-input").val();
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
        fetch (queryURL) 
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