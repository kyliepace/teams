//var Model = require("./model.js");

$(document).ready(function(){
  
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
  game.view = view;
  
 
  
  //view.game.on("click", view.submitAddGame, game.addGame.bind(game));
});

