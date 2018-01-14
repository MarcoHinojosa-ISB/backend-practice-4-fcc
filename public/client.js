// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(document).ready(function(){
  
  $('form').on('submit', function(e){
    let qString = $("#search-bar").val().trim();
    let offset = $("#num").val();
  
    window.location.href += 'search/'+qString+'?offset='+offset;
  
    e.preventDefault() 
  })

  
  $('#history').on('click', function(e){
    window.location.href += 'history';
  })
});
