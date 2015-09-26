var totalResults = [];
var markers = [];
var coords = {lat: 40.71278, long: -74.006};
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

function getInstagramPhotoList(token, lastCreat, coords) {
    var requestUrl = 'https://api.instagram.com/v1/media/search?lat=' + coords['lat'] + '&lng=' + coords['long'] + '&' + token;
    $.ajax({
      url: requestUrl,
      type: "GET",
      data: {
        distance: 1000,
        count: 20,
        max_timestamp: lastCreat
      },
      dataType: 'jsonp',
      success: function(response) {
          response.data.forEach(function(data) {
            totalResults.push(data);
          });

          populateHTML(totalResults);

        } //end success callback

    }); // end ajax call

    clearCoords(); // resetting coords array for next search

  } // end getInstagramPhotoList

function clearMap() {

  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function populateMap(totalResults) {
  clearMap();
  for (var obj in totalResults) {
    var pointer = totalResults[obj];
    pointer.image = pointer.images.thumbnail.url;
    var position = new google.maps.LatLng(pointer.location.latitude, pointer.location.longitude);

    function checkForTitleText() {
      if (pointer.caption && pointer.caption.text) {
        return pointer.caption.text;
      } else {
        return "test";
      }
    }

    pointer.marker = new google.maps.Marker({
      position: position,
      map: map,
      title: checkForTitleText(),
      icon: {
        url: pointer.image,
        size: new google.maps.Size(80, 80),
        scaledSize: new google.maps.Size(80, 80)
      }
    });
    markers.push(pointer.marker);
  }
}

function populateHTML(totalResults) {

  lastCreat = totalResults[totalResults.length - 1].created_time;
  $.each(totalResults, function(index, value) {
    if (value.videos) {
      $(".results").append("<div class='media-parent'><a data-link=" + value.link + " data-user=" + value.user.username + " href=" + value.videos.standard_resolution.url + "><video class='video' controls><source src=" + value.videos.standard_resolution.url + " type='video/mp4'></video></a></div>");
    } else {
      $(".results").append("<div class='media-parent'><a data-link=" + value.link + " data-user=" + value.user.username + " href=" + value.images.standard_resolution.url + "><img class='image' src=" + value.images.standard_resolution.url + ">" + "</a></div>");
    }
  });
  populateMap(totalResults);

  
}

function clearResults() {
  $(".results").html("");
  totalResults = [];
}

function clearGeoSearch() {
  $("#address").val("");
}

function clearCoords() {
  coords = {};
}

function initMap() {

  map = new google.maps.Map(document.getElementById('location-canvas'), {
    center: {
      lat: 40.71278,
      lng: -74.006
    },
    zoom: 11
  });

  var geocoder = new google.maps.Geocoder();

  $('#address').on('keydown', function(e) {
    if (e.which === 13) {
      geocodeAddress(geocoder, map);
    }   
  });

  $('.ion-eye').on('click', function(e) {
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
      coords.lat = (results[0].geometry.location.H);
      coords.long = (results[0].geometry.location.L);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
      markers.push(marker);
      getInstagramAccessToken();
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

  clearGeoSearch();
  clearResults();

}

$(document).ready(function() {

  if (location.hash.indexOf("access_token") > 0) {
    getInstagramAccessToken();
  } else {
    document.location = 'https://instagram.com/oauth/authorize/?client_id=2a86eedc95bf44a691694851ae41161e&redirect_uri=https://jaredhensley.github.io/instagramAPI/&response_type=token';
  }

  var $overlay = $("<div id='overlay'></div>");
  var $image = $("<img>");
  var $video = $("<video controls type='video/mp4'></video>");
  var $caption = $("<p></p>");

  $overlay.append($image);
  $overlay.append($video);
  $overlay.append($caption);
  $("body").append($overlay);

  $(".results").on("click", "a", function(event) {
    event.preventDefault();
    var href = $(this).attr("href");
    if (href.indexOf("jpg") > 0) {
      $video.attr("src", "");
      $video.hide();
      $image.show();
      $image.attr("src", href);
      var captionText = $(this).attr("data-user");
      $caption.text("<a href=" + $("p").prev("a").attr("data-link") + ">" + captionText + "</a>");
    } else if (href.indexOf("mp4") > 0) {
      $image.attr("src", "");
      $image.hide();
      $video.show();
      $video.attr("src", href);
      var captionText = $(this).attr("data-user");
      $caption.text("<a href=" + $("p").prev("a").attr("data-link") + ">" + captionText + "</a>");
    }
    
    $overlay.show();
  });

  $overlay.on("click", function() {
    $overlay.hide();
  });

});