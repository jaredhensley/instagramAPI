$(document).ready(function(){

 function getRequest() {
 	alert();
    var params = {
     count: 10
    };

    url = "https://api.instagram.com/v1/tags/coversong/media/recent?client_id=2a86eedc95bf44a691694851ae41161e";

    $.get(url, params, function(results) {
      myData = (results);
      console.log(results);
 
    });
  }

  getRequest();
});
