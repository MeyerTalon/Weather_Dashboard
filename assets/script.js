var APIKey = "4f500407c1b96e4d03821ff2280e8f0a";
var city = "San Diego";
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
fetch (queryURL) 
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    })