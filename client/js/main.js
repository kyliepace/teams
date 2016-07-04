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
  
  model.getGames();

  view.passwordInput.on("keydown", function(event){
        if(event.keyCode === 13){
            view.updateInputValues();
        }
    });
    
  view.addGameModule.on("keydown", "input", function(event){
        if(event.keyCode === 13){
            view.updateGameValues();
        }
  });
  
  view.games.on("click", ".deleteGame", function(){
        view.idToDelete = $(this).siblings(".gameId").text();
        console.log(view.idToDelete);
        model.deleteGame(view.idToDelete);
        $(this).parent(".game").remove();
    });

});

