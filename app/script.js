function AccessToken(value) {
  this.value = value;
}

function getInstagramAccessToken() {

  var hash = location.hash.replace('#', '');

  if (hash.indexOf("access_token") >= 0) {
    instagramToken = new AccessToken(hash);
    $('.igbutton').on('click', function() {getInstagramPhotoList(instagramToken);
    });
  } else {
    instagramToken = null;
  }
}

function populateHTML(totalResults) {
  //code here
  console.log(totalResults);
  $.each(totalResults,function (index, value) {
    $(".videos").append(value.images.thumbnail.url + "<br>");

  });
}

var totalResults = [];

function getInstagramPhotoList(nextPageUrl) {

    /*var requestUrl = 'https://api.instagram.com/v1/users/self/media/liked' + '?' + instagramToken.value;*/
var requestUrl = 'https://api.instagram.com/v1/media/search?lat=' + coords[0].G + '&lng=' + coords[0].K + '&' + instagramToken.value;
    $.ajax({
      url: requestUrl,
      type: "GET",
      data: {
        DISTANCE: 5000,
        MAX_TIMESTAMP: 7

      },
      dataType: 'jsonp',
      success: function(response) {
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
      console.log(results);
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