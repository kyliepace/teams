//var Model = require("./model.js");

$(document).ready(function(){
  
  // activate datepickers for all elements with a class of `datepicker`
  $('#addGameModule #datepicker').pikaday({ firstDay: 1 });

  var model = new Model();
});

