$(function (){

  $(document).ready(function(){
    $.ajax({
      type: 'GET',
      url: '/api/' + userId + '/tasks',
      success: function(data) {
        console.log(data);
        // add it to visable html
      }
    });
  });
  // $.ajax({
  //   type: 'DELETE',
  //   url: '/api/5916300320df7815a05c069a/tasks/5916fb1fe83c2b2ebc733fb1',
  //   success: function(data) {
  //     console.log(data);
  //   }
  // });



$(".newTaskInput").keypress(function(e){
  if(e.which == 13){
      var input = $(this).val();
      $.ajax({
        type: 'POST',
        url: '/api/' + userId + '/tasks?n=' + input + '&da=2&do=false',
        success: function(data) {
          console.log(data);
        }
      });
      $(this).val('');
      $.ajax({
        type: 'GET',
        url: '/api/' + userId + '/tasks',
        success: function(data) {
          console.log(data);
          // add it to visable html
        }
      });
  }
});
//
// $(".UpdateTaskButton").click(function(){
//   $.ajax({
//     type: 'POST',
//     url: '/api/5916300320df7815a05c069a/tasks?n=' + input + '&da=2&do=false',
//     success: function(data) {
//       console.log(data);
//     }
//   });
// });



});
