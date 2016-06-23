//var Model = require("./model.js");

$(document).ready(function(){
  $('#addGameModule #datepicker').pikaday({ firstDay: 1 }); // activate datepicker
  var view = new View();
  var model = new Model();
  var authUser = new AuthUser();
  var game = new Game();
  view.model = model;
  view.game = game;
  model.view = view;
  model.authUser = authUser;
  model.game = game;
  game.model = model;
  
  view.submitLogin.on('click', model.checkIfPassword.bind(model));
  view.passwordInput.keyup(function(event){
        if(event.keyCode === 13){
            view.submitLogin.trigger("click");
        }
  });
  view.game.on("click", view.submitAddGame, game.addGame.bind(game));
});

