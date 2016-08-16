var Model = function() {
    this.view;
    this.authUser;
    this.game;
    this.upcomingGames = []; 
};

///////////// LOGGING IN ///////////////////////////////////
Model.prototype.checkUser = function() {
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
    users.forEach(function(user){
        if (user.username === that.view.usernameVal){
            foundUser = user;
            console.log(foundUser); //what's saved on the server
        }
    });
    if (!foundUser.password){ //if user doesn't have a password yet, update the record with whatever they typed in input
        var user = {"_id": foundUser._id, "password": that.view.passwordVal};
        var ajax = $.ajax('/users/'+foundUser._id, {
            type: 'PUT',
            data: JSON.stringify(user),
            dataType: 'json',
            contentType: 'application/json'
        });
        ajax.done(function(response){
            that.view.onNewUserLogIn();
            that.authUser.role = response.role;
        });
    }
    else{
        var userLoggingIn = ({'username': that.view.usernameVal, 'password': that.view.passwordVal});
        var ajax2 = $.ajax('/login', {  //make a GET request to server to use passport strategy
            type: 'POST',
            data: JSON.stringify(userLoggingIn),
            dataType: 'json',
            contentType: 'application/json'
        });
        ajax2.done(function(response, err){
            if(response.status === "success"){
                that.authUser.role = foundUser.role; 
                that.view.showLoggedIn();
                console.log(that.authUser.role);
            }
            else{
                that.view.notLoggedIn();
            }
        });
    }
};

//////////////// ADDING USERS ///////////////////////////////////////
Model.prototype.addUser = function() {
    var that = this;
    var addUser = ({'username': this.view.addUsernameVal, 'role': this.view.addUserRoleVal});
    var ajax = $.ajax('/users', {
        type: 'POST',
        data: JSON.stringify(addUser),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(that.view.userAdded.bind(that.view));
};

////////////// GET SAVED GAMES ////////////////
Model.prototype.getGames = function(){
    var that = this;
    var ajax = $.ajax("/games", {
        type: "GET",
        dataType: "json"
    });
    ajax.done(function(games){
        games.forEach(function(game){
            that.game.saveGame(game); //saves Game object and pushes game to proper place on page
        });
        that.sortUpcomingGames();
        $(".material-icons.deleteGame").css("font-size", "0px");
    });
};

////////[[[[[[[[[ ADD A GAME ]]]]]] //////////////////////////////
Model.prototype.addGame = function() {
    var that = this;
    var game = ({'opponent': that.view.addGameOpponent, "date": that.view.gameDate, "time": that.view.gameTime, "location":that.view.addGameLocation});
    var ajax = $.ajax('/games', {
        type: 'POST',
        data: JSON.stringify(game),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(function(game){
        that.game.saveGame(game); //saves the game locally and calls model.updateGames()
        that.view.clearAddGameModule();
    });
};

//////////// ARRANGING AND SORTING GAMES //////////////////////
Model.prototype.updateGames = function(){
    var that = this;
    var game = ({'opponent': that.game.opponent, "date": that.game.date, "time": that.game.time, "location":that.game.location, "ourScore": that.game.ourScore, "theirScore": that.game.theirScore, "id":that.game.id});
   if(moment(that.game.date).isBefore()){ //changed to game.date from view.gameDate
       that.view.showPastGame();
   }
   else{
       that.upcomingGames.push(game);
       that.game.clearObject();
   }
   if(!that.view.logout.hasClass("hidden")){
       that.sortUpcomingGames();
   }
};
Model.prototype.sortUpcomingGames = function(){
    var that = this;
    this.upcomingGames.sort(function(a, b){
        var dateC = new Date(a.date);
        var dateD = new Date(b.date);
        return dateC > dateD ? 1 : -1;  
    });
    that.view.showNextGame();
    that.view.addToUpcomingGames();
};

///////////// EDIT AND DELETE GAMES /////////////////
Model.prototype.deleteGame = function(id){
    var that = this;
    var ajax = $.ajax('/games/'+id, {
        type: 'DELETE',
        dataType: 'json'
        //contentType: 'application/json'
    });
    ajax.done(function(game){
        console.log("removed from database");
        if(game._id === that.upcomingGames[0].id){ //we've deleted the next game. let's pick the next in line to fill that spot
            that.upcomingGames.shift();
            that.view.showNextGame();
            that.view.addToUpcomingGames();
        }
        for(var i = 1; i<that.upcomingGames.length; i++){
            if(game._id === that.upcomingGames[i].id){
                that.upcomingGames.splice(i,1);
            }
        }
    });
};
///////////////// SIGNING OUT ///////////////////////////////
Model.prototype.signout = function(){ //doesn't seem to refresh the page
    var that = this;
    var ajax = $.ajax("/signout", {
        type: "GET", 
        dataType: "json",
        contentType: "application/json"
    });
    ajax.done(function(response){
        if(response.status === "goodbye"){
            that.view.onSignOut();
        }
    });
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
    this.opponent = game.opponent;
    this.date = game.date;
    console.log(game.date);
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
    if(game.time !== undefined){
        this.time = game.time;
    }
    else{
        this.time = "";
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
};