var Model = function() {
    this.view;
    this.authUser;
    this.game;
    this.games = [];
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
        dataType: "json"
    });
    //ajax.done(that.view.onSignOut.bind(that.view));
};
Model.prototype.addGame = function() {
    console.log("let's add a game");
    var that = this;
    console.log(that.view.addGameDate);
    var game = ({'opponent': that.view.addGameOpponent, "date": that.view.addGameDate, "time": that.view.addGameTime, "location":that.view.addGameLocation});
    var ajax = $.ajax('/games', {
        type: 'POST',
        data: JSON.stringify(game),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(that.game.saveGame.bind(that.game));
};
Model.prototype.updateGames = function(){
    this.games.push(this.game);
    console.log("games updated");
    console.log(this.games);
    this.game = {}; //clear game object
    var today = new Date();
    var date = today.getDate().toString();
    var month = today.getMonth().toString();
    var year = today.getFullYear().toString();
    var todaysdate = year+month+date;
    console.log(todaysdate);
    var upcomingGames = [];
    //find next upcoming game from this.games array
    this.games.forEach(function(game){
        if (game.date>=todaysdate){
            upcomingGames.push(game);
        }
    });
    upcomingGames.sort(function(a, b){
        return a>b ? -1 : a<b ? 1 : 0; //returns games from most recent
    });
    console.log(upcomingGames);
    // append upcomingGames[0] to nextGame place on webpage
   
    //if this.game goes into the next upcoming game spot, move the one that was there (if any) to upcoming games
            //and then update the this.view.staticmap with a new background url and a href link
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
    this.opponent;
    this.time;
    this.date;
    this.ourScore;
    this.theirScore;
    this.location;
};

Game.prototype.saveGame = function(){
    console.log("talking to the games object");
    this.opponent = this.view.addGameOpponent;
    this.date = this.view.addGameDate;
    this.time = this.view.addGameTime;
    this.location = this.view.addGameLocation;
    this.ourScore = this.view.addGameOurScore;
    this.theirScore = this.view.addGameTheirScore;
    this.model.updateGames();
};


