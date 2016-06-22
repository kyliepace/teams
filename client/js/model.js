//if successful "loggedIn", show addGameButton and nav menu, header>div>p text to "Add User", and header>div>h5 text to "log off"
//if successful 'loggedIn", change header>h1 text to "Welcome {{role}}"

//if $("header input").on("keydown", function(event){ (event.key === 13) { $("addGameButton").removeClass("hidden");

//if $("addGameModule").on("keydown", function(event){event.key === 13) { submit form

//submit form only if input.val() !== ""

//submit form creates new game object in mongoose using create request to server
//replaces spaces in location value with +
var User = function(){
    this.username = "";
    this.password = "";
    this.role = "";
}


//like this except I'll be using a mongoose model:
var Game = function(location, opponent, date, time){
    this.location = location;
    this.opponent = opponent;
    this.date = date;
    this.time = time;
};

//when new game object created, sort through each game by date to find the nearest one in the future
//update DOM accordingly (server emits to client)

//