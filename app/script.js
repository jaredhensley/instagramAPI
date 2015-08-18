$(document).ready(function(){

 function getRequest() {
 	alert();
    var params = {
     count: 10
    };

    url = "https://api.instagram.com/v1/tags/coversong/media/recent?client_id=2b1f615fe19247a7a8da17d7924d2f60";

    $.get(url, params, function(results) {
      myData = (results);
      console.log(results);
 
    });
  }

  getRequest();
});
