var View = function(){
    this.model;
    this.upcomingGamesDiv = $('#upcoming .games');
    this.game = $(".game");
   
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
    
    this.message = $("#message");
    this.addUsername = $("header input.addUserInput");
    this.addUserRole = $("header select");
    this.addUserButton = $("header h5.addUser");
    this.addUserButton.on("click", this.toggleAddUser.bind(this)); 
    this.addGameOpponent = document.getElementById("opponentInput").value;
    this.addGameTime = document.getElementById("timeInput").value;
    
    this.submitNewUser = $("#submitNewUser");
    this.submitNewUser.on("click", this.updateNewInputValues.bind(this));
    this.games = $(".games");
    this.pastGames = $("#past .games");
    this.nextGame = $("#next .games");
    this.upcomingGames = $("#upcoming .games");
    this.map = $("#map");
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
    this.addGameButton.removeClass("hidden");
    if(this.model.authUser.role === "manager"){
       $(".material-icons.deleteGame").css("font-size", "24px");
       that.addUserButton.removeClass("hidden");
    }
};

View.prototype.notLoggedIn = function(){
    this.message.text("try again");
};
View.prototype.showAddGameModule = function(){
    console.log("add a game");
    this.addGameModule.toggleClass("hidden");
    var that = this;
    $("#timeInput").timepicker();
    $("#timeInput").on("changeTime", function(){
        that.gameTime =$(this).val();
    });
    $('#addGameModule #datepicker').pikaday({ 
        firstDay: 1,
        onSelect: function() {
            document.createTextNode(this.getMoment().format("MM/DD/YYYY")); //view.addGameDate should be a moment
            that.gameDate = this.getMoment().format("MM/DD/YYYY");
            console.log(that.gameDate);
        }
    }); 
};
View.prototype.onNewUserLogIn = function() {
    console.log("welcome new user");
    this.message.text("Welcome! Your password has been saved"); //notify that password has been saved
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
    document.getElementById("newUsername").value("");
};


/////////////// ADDING A NEW GAME /////////////////////////
View.prototype.updateGameValues = function(){
    console.log("let's check what's been input");
    this.addGameOpponent = document.getElementById("opponentInput").value;
    this.addGameLocation = document.getElementById("locationInput").value;
    var that = this;
    if(this.addGameOpponent !== "" || this.gameDate.toString() !== "" || this.gameTime !== "" || this.addGameLocation !== ""){
        console.log("something's been added");
        that.model.addGame();
    }
    else{
        console.log("nothing's been added");
    }
    this.addGameModule.addClass("hidden");
};
View.prototype.clearAddGameModule = function(){
    console.log("clearing Game Module");
    document.getElementById("timeInput").value = "";
    document.getElementById("opponentInput").value = "";
    document.getElementById("locationInput").value = "";
    document.getElementById("datepicker").value = "";
};


//////////////// ARRANGING GAMES ON DOM///////////////
View.prototype.makeTemplate = function(opponent, date, time, location, ourScore, theirScore, id){
    return "<div class=\"game\" title=\"directions\"><a href=\"https://www.google.com/maps/dir//"+location+"target=\"_blanck\"><p class=\"opponent\">"+opponent+"</p><input class=\"hidden opponent\" type=\"text\">\
          <p class=\"date\">"+date+"</p><input id=\"datepicker\" class=\"hidden date\">\
          <p class=\"time\">"+time+"</p><input class=\"hidden time\">\
          <p class=\"location\">"+location+"</p><input class=\"hidden location\"><div class=\"scores\">\
        <p class=\"ourScore\">"+ourScore+"</p><input class=\"hidden ourScore\"><p class=\"theirScore\">"+theirScore+"</p><input class=\"hidden theirScore\"></div></a>\
          <p class=\"hidden gameId\">"+id+"</p>\
          <i class=\"material-icons deleteGame\">clear</i></div>";
};
View.prototype.showNextGame = function(){ //use this.model.upcomingGames array. 0th position goes into next game space, the rest get arranged in the upcoming game space
    var that = this;
    this.nextGame.children(".game").remove();
    this.nextGame.prepend(that.makeTemplate(that.model.upcomingGames[0].opponent, that.model.upcomingGames[0].date, that.model.upcomingGames[0].time, that.model.upcomingGames[0].location.replace(/ /,"+"), "", "", that.model.upcomingGames[0].id));
    
    this.updateMap();
};
View.prototype.addToUpcomingGames = function(){
    this.upcomingGames.empty();
    var that = this;
    console.log("adding to upcoming games");
    for (var i = 0; i<that.model.upcomingGames.length; i++){
        that.upcomingGames.append(that.makeTemplate(that.model.upcomingGames[i].opponent, that.model.upcomingGames[i].date, that.model.upcomingGames[i].time, that.model.upcomingGames[i].location, " ", " ", that.model.upcomingGames[i].id));
    }
};
View.prototype.showPastGame = function(){
    var that = this;
    this.pastGames.append(that.makeTemplate(that.model.game.opponent, that.model.game.date, that.model.game.time, that.model.game.location, that.model.game.ourScore, that.model.game.theirScore, that.model.game.id));
    this.model.game.clearObject();
    
};

View.prototype.updateMap = function(){
    var that = this;
    this.staticMap = {
        base:"https://maps.googleapis.com/maps/api/staticmap?",
        center: that.model.upcomingGames[0].location.replace(/ /g, '+'),
        maptype:"terrain",
        visual_refresh:"true",
        scale:"2",
        size:"4000x300",
        key: "AIzaSyC2fIsU3BE1FtGxOVoApV-qE33U0d01dzo",
        markers: "size:small%7Ccolor:0xff0000%7C",
        label : that.model.upcomingGames[0].location.replace(/ /g, '+'),
        zoom :13
    };
    console.log(that.model.upcomingGames[0].location);
    console.log(this.staticMap.center);
    this.makeMapUrl(); //combine static map components into a url and use as the map background
};
//e.g. "https://maps.googleapis.com/maps/api/staticmap?center=Sacramento,+CA&maptype=terrain&visual_refresh=true&scale=2&size=4000x300&markers=size:small%7Ccolor:0xff0000%7Clabel:1%7CSacramento&zoom=13"
View.prototype.makeMapUrl = function(){
    var that = this;
    this.staticMap.url = that.staticMap.base+"center="+that.staticMap.center+"&key="+this.staticMap.key+"&maptype="+this.staticMap.terrain+"&visual_refresh="+this.staticMap.visual_refresh+"&scale="+this.staticMap.scale+"&size="+this.staticMap.size+"&markers="+this.staticMap.markers+"label:"+this.staticMap.label+"&zoom="+this.staticMap.zoom;
    console.log(that.staticMap.url);
    this.map.css("background-image", "url("+that.staticMap.url+")"); //change the background
    $("#mapLink").attr("href", "https://www.google.com/maps/dir//"+that.staticMap.center); //add a link
};
//////////////// EDITING AND DELETING GAMES ///////////////////
View.prototype.editGame = function(game){
    game.children("input").toggleClass("hidden");
    game.children("p").toggleClass("hidden");
};

View.prototype.onSignOut = function(){
    console.log("logged out");
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("newUsername").value="";
    $("material-icons.deleteGame").css("font-size", "0px");
    this.addUserButton.addClass("hidden");
    this.addGameButton.addClass("hidden");
    this.addUsername.addClass("hidden");
    this.addUserRole.addClass("hidden");
    this.logout.addClass("hidden");
    this.login.removeClass("hidden");
    this.message.text("");
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


