function getRequest() {

      console.log("inside getRequest");

      /*location.href = 'https://instagram.com/oauth/authorize/?client_id=2a86eedc95bf44a691694851ae41161e&redirect_uri=https://jaredhensley.github.io/instagramAPI/&response_type=token';*/

      function AccessToken(value) {
        this.value = value;
        console.log("inside accessToken");
      }

      function getInstagramAccessToken() {
        console.log("insideGetInstagramAccessToken");
        console.log(location.href);
        var hash = location.hash.replace('#', '');
        console.log(location.href);
        console.log(hash);
        console.log(hash.indexOf("access_token"));
        if (hash.indexOf("access_token") >= 0) {
          instagramToken = new AccessToken(hash);
          console.log(instagramToken);
          console.log(instagramToken.value);
        } else {
          instagramToken = null;
          alert('null');
        }
      }

      var photoList_Instagram = [];

      function getInstagramPhotoList(nextPageUrl) {
          var requestUrl = 'https://api.instagram.com/v1/tags/localmusic/media/recent' + '?' + instagramToken.value;
          /*if (nextPageUrl) {
            alert(nextPageUrl);
            requestUrl = nextPageUrl;
          }*/
          $.ajax({
            url: requestUrl,
            type: "GET",
            dataType: 'jsonp',
            success: function(response) {
                console.log(response);
                response.data.forEach(function(photo) {
                  photoList_Instagram.push(photo);
                });
               /* if (response.pagination.next_url) {
                  getInstagramPhotoList(response.pagination.next_url);

                } else {
                  alert('done');
                }*/
            } //success: callback
          }); // end ajax call
      } // end getInstagramPhotoList
  getInstagramAccessToken();    
  getInstagramPhotoList();
} // end getRequest

$(document).ready(function() {

  getRequest();

});

