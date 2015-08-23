function AccessToken(value) {
  this.value = value;
}

function getInstagramAccessToken() {

  var hash = location.hash.replace('#', '');

  if (hash.indexOf("access_token") >= 0) {
    instagramToken = new AccessToken(hash);
    getInstagramPhotoList(instagramToken);
  } else {
    instagramToken = null;
  }
}

function populateHTML(totalResults) {
  //code here
  console.log(totalResults);
}

var totalResults = [];

function getInstagramPhotoList(nextPageUrl) {

    /*var requestUrl = 'https://api.instagram.com/v1/users/self/media/liked' + '?' + instagramToken.value;*/
var requestUrl = 'https://api.instagram.com/v1/media/search?lat=48.858844&lng=2.294351&' + instagramToken.value;
    $.ajax({
      url: requestUrl,
      type: "GET",
      dataType: 'jsonp',
      success: function(response) {
          console.log(response);
          response.data.forEach(function(photo) {
            totalResults.push(photo);
          });
        } //end success callback
    }); // end ajax call

    populateHTML(totalResults);

  } // end getInstagramPhotoList

var map;
var coords = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397,lng: 150.644},
    zoom: 8
  });

  var geocoder = new google.maps.Geocoder();

  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);

  });
}

  function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({
      'address': address
    }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        resultsMap.setCenter(results[0].geometry.location);
        coords.push(results[0].geometry.location);
        console.log(coords);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }


$(document).ready(function() {

  getInstagramAccessToken();

});