$(document).ready(function(){

 function getRequest(searchEntry) {
 
    var params = {
     COUNT: 10,
     /*Q: searchEntry*/				
    /* q: searchEntry*/

    };

    url = "https://api.instagram.com/v1/tags/coversongs/media/recent?access_token=30069279.2a86eed.110620b05b674816bd8de88771420a2e";

    var result = $.get(url, function(results) {
      myData = (results);
      console.log(results);
 
    });
	}

  getRequest();
 
});
