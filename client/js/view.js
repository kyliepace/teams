var View = function(){
    this.model;
    this.upcomingGamesDiv = $('#upcoming .games');
    this.game = $(".game");
    ////////// ADD GAME MODULE //////////////
    this.addGameButton = $('#addGameButton');
    this.addGameButton.on("click", this.showAddGameModule.bind(this));
    this.addGameModule = $("#addGameModule");
    this.submitAddGame = $("#submitAddGame");
    this.submitAddGame.on("click", this.updateGameValues.bind(this));
    
    this.login = $("header div h5.login");
    this.login.on("click", this.toggleLogin.bind(this));
    this.logout = $("header div h5.logout");
    
    this.username = $("#username");
    this.password = $("#password");
    this.submitLogin = $('#submitLogin');
    this.submitLogin.on('click', this.updateInputValues.bind(this)); 
    this.passwordInput = $("header div .login");
    this.passwordInput.keyup(function(event){
        if(event.keyCode === 13){
            this.submitLogin.trigger("click").bind(this);
        }
    });
    this.message = $("#message");
    this.addUsername = $("header input.addUserInput");
    this.addUserRole = $("header select");
    this.addUserButton = $("header h5.addUser");
    this.addUserButton.on("click", this.toggleAddUser.bind(this)); 
    
    this.submitNewUser = $("#submitNewUser");
    this.submitNewUser.on("click", this.updateNewInputValues.bind(this));
    
    this.pastGames = $("#past .games");
    this.nextGame = $("#next .games");
    this.upcomingGames = $("#upcoming .games");
    this.map = $("#map");
    this.deleteGameButton = $(".game p.deleteGame");
    this.aGame = $(".game");
    this.aGame.on("click", "p", function(){
        var aGame = $(this).parent();
        this.editGame(aGame);
    });
    
    //click on existing game to model.editGame
};

////////// [[[[[[[[[ LOGGING ING ]]]]]]]]]] //////////
View.prototype.toggleLogin = function(){
    this.username.toggleClass("hidden");
    this.password.toggleClass("hidden");
    this.submitLogin.toggleClass("hidden");
};
View.prototype.updateInputValues = function(){
    console.log("inputs updated");
    this.usernameVal = document.getElementById("username").value;
    this.passwordVal = document.getElementById("password").value;
    var that = this;
    if(this.usernameVal !=="" && this.passwordVal !== ""){
        that.model.checkUser();
    }
};
View.prototype.showLoggedIn = function(){
    console.log("logged in");
    this.login.addClass("hidden");
    this.logout.removeClass("hidden");
    var that = this;
    this.logout.on("click", that.model.signout.bind(that.model));
    this.username.addClass("hidden");
    this.password.addClass("hidden");
    this.submitLogin.addClass("hidden");
    this.addUserButton.removeClass("hidden"); //make this a condition of authUser.role
    this.addGameButton.removeClass("hidden");
    if(this.model.authUser.role === "manager"){
        that.deleteGameButton.removeClass("hidden");
    }
};

View.prototype.notLoggedIn = function(){
    this.message.text("try again");
};
View.prototype.showAddGameModule = function(){
    this.addGameModule.toggleClass("hidden");
    var that = this;
    $('#addGameModule #datepicker').pikaday({ 
        firstDay: 1,
        onSelect: function() {
            that.addGameDate = document.createTextNode(this.getMoment().format("MM/DD/YYYY")); //view.addGameDate should be a moment
            that.gameDate = this.getMoment().format("MM/DD/YYYY");
        }
    }); 
};
View.prototype.onNewUserLogIn = function() {
    console.log("welcome new user");
    //notify that password has been saved
    this.message.text("Welcome! Your password has been saved");
    this.showLoggedIn();
};


//////////// ADDING A NEW USER /////////////////////////////////////////////////
View.prototype.toggleAddUser = function(){
    this.addUsername.toggleClass("hidden");
    this.addUserRole.toggleClass("hidden");
};
View.prototype.updateNewInputValues = function(){
    this.addUsernameVal =  document.getElementById("newUsername").value;
    this.addUserRoleVal = document.getElementById("newRole").value;
    this.model.addUser();
};
View.prototype.userAdded = function() {
    console.log("added user");
    this.toggleAddUser();
    this.addUsernameVal.text("");
};


/////////////// ADDING A NEW GAME /////////////////////////
View.prototype.updateGameValues = function(){
    console.log("let's check what's been input");
    this.addGameOpponent = document.getElementById("opponentInput").value;
    console.log(typeof(this.addGameDate));
    this.addGameTime = document.getElementById("timeInput").value;
    this.addGameLocation = document.getElementById("locationInput").value;
    var that = this;
    if(this.addGameOpponent !== "" || this.addGameDate.toString() !== "" || this.addGameTime !== "" || this.addGameLocation !== ""){
        console.log("something's been added");
        that.model.addGame();
    }
    else{
        console.log("nothing's been added");
    }
};
View.prototype.clearAddGameModule = function(){
    console.log("clearing Game Module");
    document.getElementById("timeInput").value = "";
    document.getElementById("opponentInput").value = "";
    document.getElementById("locationInput").value = "";
    document.getElementById("datepicker").value = "";
};


//////////////// ARRANGING GAMES ON DOM///////////////
View.prototype.showUpcomingGame = function(){ //use this.model.upcomingGames array. 0th position goes into next game space, the rest get arranged in the upcoming game space
    var that = this;
    this.nextGame.prepend(this.makeTemplate(that.model.upcomingGames[0]));
    this.updateMap();
    /*for (var i = 1; i<that.model.upcomingGames.length; i++){
        var futureGame = this.makeTemplate(that.model.upcomingGames[i]);
        this.upcomingGames.append(futureGame);
    }*/ //do this upon loading the page
    this.model.game.clearObject(); //which calls view.clearAddGameModule();
};
View.prototype.makeTemplate = function(game){
    return "<div class=\"game\"><p class=\"opponent\">"+game.opponent+"</p><input class=\"hidden opponent\" type=\"text\" placeholder=\"opponent\">\
          <p class=\"date\">"+game.date.toString()+"</p><input id=\"datepicker\" class=\"hidden date\"  placeholder=\"date\">\
          <p class=\"time\">"+game.time+"</p><input class=\"hidden time\" placeholder=\"time\">\
          <p class=\"location\">"+game.location+"</p><input class=\"hidden location\" placeholder=\"location\"></div>";
};
View.prototype.showPastGame = function(){
    var that = this;
    this.pastGameTemplate = "<div class=\"game\"><p class=\"opponent\">"+that.model.game.opponent+"</p><p class=\"date\">"+that.model.game.date.toString()+"\
        </p><p class=\"time\">"+that.model.game.time+"</p><p class=\"location\">"+that.model.game.location+"</p><div class=\"scores\">\
        <p class=\"ourScore\">"+that.model.game.ourScore+"</p><p class=\"theirScore\">"+that.model.game.theirScore+"</p><p class=\"hidden deleteGame\">X</p></div></div>";
    this.pastGames.append(this.pastGameTemplate);
    this.model.game.clearObject();
};
View.prototype.updateMap = function(){
    var nextGame = this.model.upcomingGames[0];
    var that = this;
    this.staticMap = {
        base:"https://maps.googleapis.com/maps/api/staticmap?",
        center: that.model.upcomingGames[0].location.replace(" ","+"),
        maptype:"terrain",
        visual_refresh:"true",
        scale:"2",
        size:"4000x300",
        markers: "size:small%7Ccolor:0xff0000%7C",
        label : "",
        zoom :13
    };
    this.makeMapUrl(); //combine static map components into a url and use as the map background
}
//e.g. "https://maps.googleapis.com/maps/api/staticmap?center=Sacramento,+CA&maptype=terrain&visual_refresh=true&scale=2&size=4000x300&markers=size:small%7Ccolor:0xff0000%7Clabel:1%7CSacramento&zoom=13"
View.prototype.makeMapUrl = function(){
    var that = this;
    this.staticMap.url = this.staticMap.base+"center"+this.staticMap.center+"&maptype="+this.staticMap.terrain+"&visual_refresh="+this.staticMap.visual_refresh+"&scale="+this.staticMap.scale+"&size="+this.staticMap.size+"&markers="+this.staticMap.markers+"label:"+this.staticMap.label+"&zoom="+this.staticMap.zoom;
    this.map.css("background-image", "url("+that.staticMap.url+")"); //change the background
    this.map.attr("href", that.staticMap.url); //add a link
};
View.prototype.editGame = function(game){
    game.children("input").toggleClass("hidden");
    game.children("p").toggleClass("hidden");
};

View.prototype.onSignOut = function(){
    this.addUserButton.addClass("hidden");
    this.addGameButton.addClass("hidden");
    this.logout.addClass("hidden");
    this.login.removeClass("hidden");
};
/*  Would be nice to have an autocomplete in the addGameModule
Model.prototype.mapAutocomplete = function(input){
    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(37.8000, -120.0000),
        new google.maps.LatLng(39.0000, -123.0000));

    var searchBox = new google.maps.places.SearchBox(input, {
    bounds: defaultBounds
    });
};
*/


