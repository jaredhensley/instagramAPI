var totalResults = [];
var markers = [];
var coords = {lat: 40.71278, long: -74.006 };
var map;
var lastCreat;
var oldAddress;
var token;
var markers;


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
    data: { distance: 1000, count: 20, max_timestamp: lastCreat }, 
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
          size: new google.maps.Size(40,40)
        }

    });
  }
}

  
function populateHTML(totalResults) {

  lastCreat = totalResults[totalResults.length-1].created_time;
  $.each(totalResults, function(index, value) {
    if (value.videos) {
      $(".results").append("<a href=" + value.videos.low_resolution.url + "><video class='video' controls><source src=" + value.videos.low_resolution.url + " type='video/mp4'> </video> </a>");
    } else {
      $(".results").append("<a href="+value.images.standard_resolution.url +"><img class='image' src=" + value.images.standard_resolution.url + ">" + "</a>");
    }
  });
  populateMap(totalResults);
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


function initMap() {
  
  map = new google.maps.Map(document.getElementById('location-canvas'), {
    center: {
      lat: 40.71278,
      lng: -74.006
    },
    zoom:  11
  });

  var geocoder = new google.maps.Geocoder();

  $('.ion-eye').on('keydown click', function() {
    geocodeAddress(geocoder, map); 
  });

  /*google.maps.event.addDomListener(window, 'resize', initMap);
  google.maps.event.addDomListener(window, 'load', initMap);
*/}


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

  if (location.hash.indexOf("access_token") > 0 ) {
    getInstagramAccessToken();
  } else {
  document.location = 'https://instagram.com/oauth/authorize/?client_id=2a86eedc95bf44a691694851ae41161e&redirect_uri=https://jaredhensley.github.io/instagramAPI/&response_type=token';
  }

  var $overlay = $("<div id='overlay'></div>");
  var $image =  $("<img>");
  var $video = $("<video controls type='video/mp4'></video>");

  $overlay.append($image);
  $overlay.append($video);
  $("body").append($overlay);
  
  $(".results").on("click", "a", function(event){
    event.preventDefault();
    var href = $(this).attr("href");
    if (href.indexOf("jpg") > 0) {
      $video.attr("src", "");
      $image.attr("src", href);
    } else if (href.indexOf("mp4") > 0) {
      $image.attr("src", "");
      $video.attr("src", href);
    }
    $overlay.show();
  });

  $overlay.on("click", function() {
    $overlay.hide();
  });

});
