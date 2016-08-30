$(document).ready(function() {

  $('form#new-todo').submit(function(e){
    var todos = $('ul#todo-list').html();
    todos += '<li>' + e.target[0].value + '</li>';
    $("input[type='text']").val('')
    $('ul#todo-list').html(todos);
    e.preventDefault();
  });
});
