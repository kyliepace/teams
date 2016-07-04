var Model = function() {
    this.view;
    this.authUser;
    this.game;
    this.games = []; //populate from server
    this.upcomingGames = []; 
};

Model.prototype.checkUser = function() {
    console.log(this.view.usernameVal);
    var that = this;
    if(this.username !== "" && this.password !== ""){
        var ajax = $.ajax('/users', {  //make a GET request to server and find the user with the given username
            type: 'GET',
            dataType: 'json'
        });
        ajax.done(that.onGetUsersDone.bind(that));  //gets list of all users
    }
};


Model.prototype.onGetUsersDone = function(users) { 
    var that = this;
    var foundUser = {};
    console.log(this.view.usernameVal);
    users.forEach(function(user){
        if (user.username === that.view.usernameVal){
            foundUser = user;
            console.log(foundUser); //what's saved on the server
        }
    });
    that.authUser.role = foundUser.role; 
    if (!foundUser.password){ //if user doesn't have a password yet, update the record with whatever they typed in input
        var user = {"_id": foundUser._id, "password": that.view.passwordVal} ;
        var ajax = $.ajax('/users/'+foundUser._id, {
            type: 'PUT',
            data: JSON.stringify(user),
            dataType: 'json',
            contentType: 'application/json'
        });
        ajax.done(that.view.onNewUserLogIn.bind(that.view)); //notify the user that their password has been saved and they are signed in
    }
    else{
        var userLoggingIn = ({'username': that.view.usernameVal, 'password': that.view.passwordVal});
        console.log(userLoggingIn);
        var ajax2 = $.ajax('/login', {  //make a GET request to server to use passport strategy
            type: 'POST',
            data: JSON.stringify(userLoggingIn),
            dataType: 'json',
            contentType: 'application/json'
        });
        ajax2.done(function(response){
            console.log(response.status);
            if(response.status === "success"){
                that.view.showLoggedIn(); 
            }
            else{
                that.view.notLoggedIn();
            }
        });
    }
};
Model.prototype.addUser = function() {
    var that = this;
    console.log(this.view.addUsernameVal+" "+this.view.addUserRoleVal);
    var addUser = ({'username': this.view.addUsernameVal, 'role': this.view.addUserRoleVal});
    var ajax = $.ajax('/users', {
        type: 'POST',
        data: JSON.stringify(addUser),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(that.view.userAdded.bind(that.view));
};

Model.prototype.signout = function(){ //doesn't seem to refresh the page
    console.log("goodbye");
    var that = this;
    var ajax = $.ajax("/signout", {
        type: "GET", 
        dataType: "json",
        contentType: "application/json"
    });
    ajax.done(that.view.onSignOut.bind(that.view));
};



////////////// GET SAVED GAMES ////////////////
Model.prototype.getGames = function(){
    var that = this;
    console.log("retrieving saved games");
    var ajax = $.ajax("/games", {
        type: "GET",
        dataType: "json"
    });
    ajax.done(function(games){
        games.forEach(function(game){
            that.game.saveGame(game); //saves Game object and pushes game to proper place on page
        });
        that.view.addToUpcomingGames();
    });
};




////////[[[[[[[[[ ADD A GAME ]]]]]] //////////////////////////////
Model.prototype.addGame = function() {
    console.log("adding game");
    var that = this;
    console.log(that.view.addGameDate);
    var game = ({'opponent': that.view.addGameOpponent, "date": that.view.gameDate, "time": that.view.addGameTime, "location":that.view.addGameLocation});
    this.games.push(game);
    var ajax = $.ajax('/games', {
        type: 'POST',
        data: JSON.stringify(game),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(that.game.saveGame.bind(that.game));
};
Model.prototype.updateGames = function(){
    var that = this;
    var game = ({'opponent': that.game.opponent, "date": that.game.date, "time": that.game.time, "location":that.game.location, "ourScore": that.game.ourScore, "theirScore": that.game.theirScore, "id":that.game.id});
   if(moment(that.game.date).isBefore()){ //changed to game.date from view.gameDate
       that.view.showPastGame();
   }
   else{
       that.upcomingGames.push(game);
       that.sortUpcomingGames();
   }
};
Model.prototype.sortUpcomingGames = function(){
    var that = this;
    this.upcomingGames.sort(function(a, b){
        return a>b ? -1 : a<b ? 1 : 0; //returns games from most recent
    });
    console.log(this.upcomingGames);
    if(this.upcomingGames[0].date === this.game.date){
        console.log("added game is the newest game");
        that.view.showNextGame();
    }
    else{
        //that.view.addToUpcomingGames();
        console.log("add to upcoming games");
    }
    that.game.clearObject();
};

///////////// EDIT AND DELETE GAMES /////////////////
Model.prototype.deleteGame = function(id){
    var that = this;
    console.log(id);
    var ajax = $.ajax('/games/'+id, {
        type: 'DELETE',
        dataType: 'json'
        //contentType: 'application/json'
    });
    ajax.done(console.log("removed from database"));
};
    
Model.prototype.editGame= function(game) {
    //toggleClass("hidden") to all the ps and the inputs in the selected game
};






//////////////// AUTH USER OBJECT ////////////////////
var AuthUser = function(){
    this.role;    
}


////////////////////// GAME OBJECT //////////////////////////////
var Game = function(){
    this.model;
    this.view;
    this.id;
    this.opponent;
    this.time;
    this.date;
    this.ourScore;
    this.theirScore;
    this.location;
};

Game.prototype.saveGame = function(game){
    console.log("Game.saveGame");
    this.opponent = game.opponent;
    this.date = game.date;
    console.log(game.date);
    this.time = game.time;
    this.location = game.location;
    this.id = game._id;
    if(game.ourScore !== undefined){
        this.ourScore = game.ourScore
    }
    else{
        this.ourScore = "";
    }
    if(game.theirScore !== undefined){
        this.theirScore = game.theirScore;
    }
    else{
        this.theirScore = "";
    }
    this.model.updateGames();
};

Game.prototype.clearObject = function(){
    console.log("clearing game object");
    this.opponent = "";
    this.time = "";
    this.date = "";
    this.location = "";
    this.id = "";
    this.ourScore = "";
    this.theirScore = "";
    this.model.view.clearAddGameModule();
};


