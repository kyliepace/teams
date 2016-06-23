
var Model = function() {
    this.view;
    this.authUser;
    this.game;
    this.games = [];
    
    //this.submitNewUser.on("click", this.addUser(this.addUsername, this.addUserRole));
    
    //this.updateGame = //make button
    //this.game.on("click", "p", this.editGame(this.game).bind(this));
    //this.game.on("click", ".updateGame", this.saveChanges.bind(this));
};


Model.prototype.onAddGameClick = function() {
    this.view.addGameModule.toggleClass("hidden");
};
Model.prototype.checkIfPassword = function() {
    this.username = document.getElementById("username").value;
    this.password = document.getElementById("password").value;
    console.log(this.username + this.password);
    var that = this;
    if(this.username !== "" && this.password !== ""){
        var ajax = $.ajax('/users', {  //make a GET request to server and find the user with the given username
            type: 'GET',
            dataType: 'json'
        });
        ajax.done(that.onGetUsersDone);  //gets list of all users
    }
};

Model.prototype.onGetUsersDone = function(users) { 
    var that = this;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var foundUser = {};
    console.log(username);
    console.log(users);
    users.forEach(function(user){
        if (user.username == username){
            foundUser = user;
            console.log(foundUser); //what's saved on the server
        }
    });
    //that.authUser.role = foundUser.role; can't set authUser.role from here
    if (!foundUser.password){ //if user doesn't have a password yet, update the record with whatever they typed in input
        var user = {"_id": foundUser._id, "password": password} ;
        var ajax = $.ajax('/users/'+foundUser._id, {
            type: 'PUT',
            data: JSON.stringify(user),
            dataType: 'json',
            contentType: 'application/json'
        });
        ajax.done(that.onNewUserLogIn); //notify the user that their password has been saved and they are signed in
    }
    else{
        var userLoggingIn = ({'username': username, 'password': password});
        console.log(userLoggingIn);
        var ajax2 = $.ajax('/login', {  //make a GET request to server to use passport strategy
            type: 'POST',
            data: JSON.stringify(userLoggingIn),
            dataType: 'json',
            contentType: 'application/json'
        });
        ajax2.done(function(response){
            console.log(response);
            if(response.status === "success"){
                $("header form .login").addClass("hidden");
                $("header div h5.addUser").removeClass("hidden");
                $("header div h5.login").text("Log out");
                $("#addGameButton").removeClass("hidden");
            }
            else{
                $("#message").text("wrong password");
            }
        });
    }
};

Model.prototype.onNewUserSignIn = function() {
    console.log("welcome new user");
    //notify that password has been saved
    this.view.message.text("Welcome! Your password has been saved");
    this.view.addGameButton.removeClass("hidden"); //show "add game" button
    if(this.authUser.role === "manager"){
            this.view.addUserButton.removeClass("hidden"); //show "add user" button
        }
};
Model.prototype.checkPassportRes = function(response) {
    if(response.body.status === "success"){
        console.log("logged in!");
        this.view.message.text("Welcome back!");
        this.view.addGameButton.removeClass("hidden"); //show "add game" button
        if(this.authUser.role === "manager"){
             this.view.addUserButton.removeClass("hidden"); //show "add user" button
        }
    }
    else{
        console.log("Incorrect password");
    }
};

Model.prototype.showAddUser = function() {
    this.addUsername.toggleClass("hidden");
    this.addUserRole.toggleClass("hidden");
    this.submitNewUser.toggleClass("hidden");
};
Model.prototype.addUser = function(username, role) {
    var user = {'username': username, 'role': role};
    var ajax = $.ajax('/users', {
        type: 'POST',
        data: JSON.stringify(user),
        dataType: 'json',
        //contentType: 'application/json'
    });
    ajax.done(this.userAdded.bind(this));
};
Model.prototype.userAdded = function() {
    this.addUsername.val("");
    this.addUserRole.val("player");
    this.message.text("user added").delay(4000).text("");
};
Model.prototype.addGame = function() {
    var game = {'opponent': this.game.opponent, "date": this.game.date, "time": this.game.time, "location":this.game.location, "ourScore":this.game.ourScore, "theirScore":this.game.theirScore};
    var that = this;
    var ajax = $.ajax('/games', {
        type: 'POST',
        data: JSON.stringify(game),
        dataType: 'json',
        //contentType: 'application/json'
    });
    ajax.done(that.arrangeGames);
};
Model.prototype.editGame= function(game) {
    //toggleClass("hidden") to all the ps and the inputs in the selected game
};

var AuthUser = function(){
    this.role;    
}

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

Game.prototype.addGame = function(){
    this.opponent = this.view.addGameOpponent;
    this.date = this.view.addGameDate;
    this.time = this.view.addGameTime;
    this.location = this.view.addGameLocation;
    this.ourScore = this.view.addGameOurScore;
    this.theirScore = this.view.addGameTheirScore;
    this.model.addGame();
}


