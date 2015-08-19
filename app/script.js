$(document).ready(function(){
location.href = 'https://instagram.com/oauth/authorize/?client_id=2a86eedc95bf44a691694851ae41161e&redirect_uri=https://jaredhensley.github.io/instagramAPI/&response_type=token';
 function getRequest(searchEntry) {
 
    var params = {
     COUNT: 10,
     type: "video"
    };

    url = "https://api.instagram.com/v1/tags/localmusic/media/recent?access_token=30069279.2a86eed.110620b05b674816bd8de88771420a2e";

    // var result = $.get(url, function(results) {
    //   myData = (results);
    //   console.log(results);
 
    // });

		var result = $.ajax({
			url: url,
      data: params,
      type: "GET",
			dataType: 'jsonp',
			success: function(response){
				console.log('success:');
				console.log(response.data);
			}
		});
	}

  getRequest();
 
});
