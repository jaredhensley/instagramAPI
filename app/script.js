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
  } else {
    token = null;
  }
}

function populateHTML(totalResults) {
  lastCreat = totalResults[totalResults.length-1].created_time;
  $.each(totalResults, function(index, value) {
    if (value.videos) {
      $(".results").append("<a href=" + value.videos.low_resolution.url + "><video width='24%' height='32%' controls><source src=" + value.videos.low_resolution.url + " type='video/mp4'> </video> </a>");
    } else {
      $(".results").append("<a href="+value.images.standard_resolution.url +"><img height='32%' width='24%' src=" + value.images.standard_resolution.url + ">" + "</a>");
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
  var requestUrl = 'https://api.instagram.com/v1/media/search?lat=' + coords['lat'] + '&lng=' + coords['long'] + '&' + token;
  $.ajax({
    url: requestUrl,
    type: "GET",
    data: { distance: 1000, count: 20, max_timestamp: lastCreat }, 
    dataType: 'jsonp',
    success: function(response) {
     /* console.log('RequestURL from success call: ', requestUrl);
      console.log(response);*/
      response.data.forEach(function(data) {
      totalResults.push(data);
      });
          
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
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      coords.lat = (results[0].geometry.location.G);
      coords.long = (results[0].geometry.location.K);
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
    getInstagramAccessToken();
  } else {
  document.location = 'https://instagram.com/oauth/authorize/?client_id=2a86eedc95bf44a691694851ae41161e&redirect_uri=https://jaredhensley.github.io/instagramAPI/&response_type=token';
  }
  

});
