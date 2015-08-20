
      /*location.href = 'https://instagram.com/oauth/authorize/?client_id=2a86eedc95bf44a691694851ae41161e&redirect_uri=https://jaredhensley.github.io/instagramAPI/&response_type=token';*/

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

      }

      var totalResults = [];

      function getInstagramPhotoList(nextPageUrl) {
          var requestUrl = 'https://api.instagram.com/v1/tags/saintsandsailors/media/recent' + '?' + instagramToken.value;
          if (nextPageUrl) {
            requestUrl = nextPageUrl;
          }
          $.ajax({
            url: requestUrl,
            type: "GET",
            dataType: 'jsonp',
            success: function(response) {
                console.log(response);
              response.data.forEach(function(photo) {
                  totalResults.push(photo);
                });
               if (response.pagination.next_url) {
                  getInstagramPhotoList(response.pagination.next_url);

                } else {
                  alert('done');
                }
            } //success: callback
          }); // end ajax call
          populateHTML(totalResults);
      } // end getInstagramPhotoList

$(document).ready(function() {
  getInstagramAccessToken();
});

