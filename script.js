 var weatherURL = 'http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=c1be6b59e77dbb0904b3a46d76bb3fff'


//Array holding search from local storage
var locations = [""];
$.ajax({
  url: weatherURL,
  method: 'GET',
}).then(function (response) {
  
   // Creating a div to hold the location
  // var Div = $("<div class='location'>");
  
  console.log(response);
});


function displayLocation() {
  var location = $(this).attr("data-name");
  var queryURL = "http://api.openweathermap.org/data/2.5/forecast?id=" + location + "&APPID=c1be6b59e77dbb0904b3a46d76bb3fff";



$.ajax({
  url: weatherURL,
  method: 'GET',
}).then(function (response) {
  
   // Creating a div to hold the location
  // var Div = $("<div class='location'>");
  
  console.log(response);
});

}