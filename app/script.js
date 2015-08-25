var totalResults = [];
var map;
var coords = [];
var lastCreat;

function AccessToken(value) {
  this.value = value;
}


function getInstagramAccessToken() {

  var hash = location.hash.replace('#', '');

  if (hash.indexOf("access_token") >= 0) {
    console.log('test');
    instagramToken = new AccessToken(hash);
    instagramAjaxCall(instagramToken);
  } else {
    console.log('no token');
    instagramToken = null;
  }
}


function instagramAjaxCall(instagramToken) {
  $('.igbutton').on('click', function() {
    getInstagramPhotoList(instagramToken, lastCreat);
  });
}


function populateHTML(totalResults) {
 /* console.log(totalResults[totalResults.length-1].created_time);*/
  lastCreat = totalResults[totalResults.length-1].created_time;
  console.log(totalResults);
  $.each(totalResults, function(index, value) {
    $(".results").append("<img src=" + value.images.thumbnail.url + ">" + " ");

  });
}


function getInstagramPhotoList(token, lastCreat) {
console.log(lastCreat);
    /*var requestUrl = 'https://api.instagram.com/v1/users/self/media/liked' + '?' + instagramToken.value;*/
    var requestUrl = 'https://api.instagram.com/v1/media/search?lat=' + coords[0].G + '&lng=' + coords[0].K + '&' + token.value;
    $.ajax({
      url: requestUrl,
      type: "GET",
      data: { distance: 1000, count: 20, max_timestamp: lastCreat }, 
      dataType: 'jsonp',
      success: function(response) {
          console.log(response);
          response.data.forEach(function(data) {
            totalResults.push(data);
          });
          
          console.log(lastCreat);
          populateHTML(totalResults);

        } //end success callback

    }); // end ajax call
    coords = []; //resetting coords array for next search
  } // end getInstagramPhotoList


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -34.397,
      lng: 150.644
    },
    zoom: 6
  });

  var geocoder = new google.maps.Geocoder();

  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);  //rework this

  });
}


function geocodeAddress(geocoder, resultsMap) {
  coords = [];
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
  $("#address").val("");  //make a general function
  $(".results").html("");
  totalResults = [];
  
}


$(document).ready(function() {

  getInstagramAccessToken();

});