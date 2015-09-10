var totalResults = [];
var coords = {lat: 40.71278, long: -74.006 };
var map;
var lastCreat;
var oldAddress;
var token;


function getInstagramAccessToken() {

  var token = location.hash.replace('#', '');

  if (token.indexOf("access_token") >= 0) {
    getInstagramPhotoList(token, lastCreat, coords);
    console.log(coords);
  } else {
    token = null;
  }
}

function populateHTML(totalResults) {
  lastCreat = totalResults[totalResults.length-1].created_time;
  console.log(totalResults);
  $.each(totalResults, function(index, value) {
    if (value.videos) {
      console.log(value.videos);
      $(".results").append("<video width='240' height='240' controls><source src=" + value.videos.low_resolution.url + " type='video/mp4'> </video>" + " ");
    } else {
      $(".results").append("<img src=" + value.images.thumbnail.url + ">" + " ");
    }
  });
}


function clearResults () {
  $(".results").html("");
  totalResults = [];
}


function clearGeoSearch () {
  $("#address").val(""); 
}


function clearCoords () {
  coords = {};
}


function getInstagramPhotoList(token, lastCreat, coords) {
  console.log(coords);
  console.log(lastCreat);
  var requestUrl = 'https://api.instagram.com/v1/media/search?lat=' + coords['lat'] + '&lng=' + coords['long'] + '&' + token;
  $.ajax({
    url: requestUrl,
    type: "GET",
    data: { distance: 1000, count: 20, max_timestamp: lastCreat }, 
    dataType: 'jsonp',
    success: function(response) {
      console.log('RequestURL from success call: ', requestUrl);
      console.log(response);
      response.data.forEach(function(data) {
      totalResults.push(data);
      });
          
      console.log(lastCreat);
      populateHTML(totalResults);

    } //end success callback

  }); // end ajax call
  clearCoords(); // resetting coords array for next search
} // end getInstagramPhotoList


function initMap() {
  
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 40.71278,
      lng: -74.006
    },
    zoom: 9
  });

  var geocoder = new google.maps.Geocoder();

  $('#submit').on('keydown click', function() {
    geocodeAddress(geocoder, map); 
  });
}


function checkIfNewAddress(address) {
  if (address !== oldAddress) {
    oldAddress = address;
    lastCreat = null;
  } else {
    oldAddress = address;
  }
}


function geocodeAddress(geocoder, resultsMap) {
  clearCoords();
  var address = document.getElementById('address').value;
  checkIfNewAddress(address);
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    console.log(results);
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      coords.lat = (results[0].geometry.location.G);
      coords.long = (results[0].geometry.location.K);
      console.log(coords);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
       getInstagramAccessToken()
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
  
  clearGeoSearch();
  clearResults();  
  
}


$(document).ready(function() {
  if (location.hash.indexOf("access_token") > 0 ) {
    console.log(location.hash.indexOf("access_token"));
    getInstagramAccessToken();
  } else {
  document.location = 'https://instagram.com/oauth/authorize/?client_id=2a86eedc95bf44a691694851ae41161e&redirect_uri=https://jaredhensley.github.io/instagramAPI/&response_type=token';
  }
  

});