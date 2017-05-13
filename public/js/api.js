console.log("API.js is here");

$(function (){

  $.ajax({
    type: 'DELETE',
    url: '/api/5916300320df7815a05c069a/tasks/5916fb1fe83c2b2ebc733fb1',
    success: function(data) {
      console.log(data);
    }
  });

});
