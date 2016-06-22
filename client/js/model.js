
var Model = function() {
    this.games = [];
    this.upcomingGamesDiv = $('#upcoming .games');
    
    this.addGameButton = $('#addGameButton');
    this.addGameButton.on("click", this.onAddGameClick.bind(this));
    this.addGameModule = $("#addGameModule");
    this.addGameOpponent = $("#addGameModule .opponent").val();
    this.addGameDate = $("#addGameModule .date").val();
    this.addGameTime = $("#addGameModule .time").val();
    this.addGameLocation = $("#addGameModule .location").val();
    this.addGameOurScore = $("#addGameModule .ourScore").val();
    this.addGameTheirScore =$("#addGameModule .theirScore").val();
    this.counter = 0;
    
    this.username = $("header div username");
    this.password = $("header div password");
    this.role;
    this.submitLogin = $('#submitLogin');
    
    this.passwordInput = $("header div .login");
    
    this.message = $("#message");
    
    this.addUserButton = $("header h5.addUser");
    this.addUsername = $("header username.addUser").val();
    this.addUserRole = $("header select").val();
    this.submitNewUser = $("#submitNewUser");
    
    this.submitLogin.on('click', this.checkIfPassword.bind(this));
    this.passwordInput.keyup(function(event){
        if(event.keyCode === 13){
            this.submitLogin.bind(this).trigger("click");
        }
    });
    this.addUserButton.on("click", this.showAddUser.bind(this));
    this.submitNewUser.on("click", this.addUser(this.addUsername, this.addUserRole).bind(this));
};
Model.prototype.onAddGameClick = function() {
    this.counter ++;
    this.addGameModule.toggleClass("hidden");
    if(this.counter%2 === 0){
        this.addGame(this.addGameOpponent, this.addGameDate, this.addGameTime, this.addGameLocation).bind(this);//call addGame function if button has been clicked an even number of times
    }
};
Model.prototype.checkIfPassword = function() {
    if(this.username !== "" && this.password !== ""){
        var ajax = $.ajax('/users', {  //make a GET request to server and find the user with the given username
            type: 'GET',
            dataType: 'json'
        });
        ajax.done(this.onGetUsersDone.bind(this));  //gets list of all users
    }
};
Model.prototype.onGetUsersDone = function(users) {  
    var foundUser = users.filter( function(el){ //finds user in list of users
        el.username === this.username;
    });
    this.role = foundUser.role;
    if (!foundUser.password){ //if user doesn't have a password yet, update the record with whatever they typed in input
        var user = {"password": this.password, "_id": foundUser._id};
        var ajax = $.ajax('/items'+foundUser._id, {
            type: 'PUT',
            data: JSON.stringify(user),
            dataType: 'json',
            //contentType: 'application/json'
        });
        ajax.done(this.onNewUserLogIn.bind(this)); //notify the user that their password has been saved and they are signed in
    }
    else{
        this.usePassport.bind(this);  //if foundUser does already have a password, check that it matches
    }
};
Model.prototype.usePassport = function() {
    var ajax = $.ajax('/login', {  //make a GET request to server to use passport strategy
            type: 'GET',
            dataType: 'json'
        });
    ajax.done(this.checkPassportRes.bind(this));
};
Model.prototype.onNewUserSignIn = function(event) {
    //notify that password has been saved
    this.message.text("Welcome! Your password has been saved");
    this.addGameButton.removeClass("hidden"); //show "add game" button
    if(this.role === "manager"){
            this.addUserButton.removeClass("hidden"); //show "add user" button
        }
};
Model.prototype.checkPassportRes = function(response) {
    if(response.status === "success"){
        this.message.text("Welcome back!");
        this.addGameButton.removeClass("hidden"); //show "add game" button
        if(this.role === "manager"){
             this.addUserButton.removeClass("hidden"); //show "add user" button
        }
    }
    else{
        this.message.text("Incorrect password");
    }
};
Model.prototype.addGame = function(opponent, date, time, location, ourScore, theirScore) {
    var game = {'opponent': opponent, "date": date, "time": time, "location":location, "ourScore":ourScore, "theirScore":theirScore};
    var ajax = $.ajax('/games', {
        type: 'POST',
        data: JSON.stringify(game),
        dataType: 'json',
        //contentType: 'application/json'
    });
    ajax.done(this.arrangeGames);
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
        data: JSON.stringify(item),
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
ShoppingList.prototype.updateItemsView = function() {
    var context = {
        items: this.items
    };
    var itemList = $(this.itemListTemplate(context));
    this.itemList.replaceWith(itemList);
    this.itemList = itemList;
};

module.exports = Model();