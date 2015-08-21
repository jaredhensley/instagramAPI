
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
  var requestUrl = 'https://api.instagram.com/v1/users/self/media/liked' + '?' + instagramToken.value;
  /* if (nextPageUrl) {
     requestUrl = nextPageUrl;
     }*/
  $.ajax({
    url: requestUrl,
    type: "GET",
    dataType: 'jsonp',
    success: function(response) {
      console.log(response);
      response.data.forEach(function(photo) {
      totalResults.push(photo);
    });
  /*if (response.pagination.next_url) {
    getInstagramPhotoList(response.pagination.next_url);

    } else {
      alert('done');
    }*/
    } //success: callback
    }); // end ajax call
  populateHTML(totalResults);
} // end getInstagramPhotoList

$(document).ready(function() {
  getInstagramAccessToken();
});

