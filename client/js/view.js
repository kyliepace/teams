//send request to google

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
    
    //click on existing game to model.editGame
    
    this.staticMap = {
        base:"https://maps.googleapis.com/maps/api/staticmap?",
        center: "",//make sure input string replaces spaces with +
        maptype:"terrain",
        visual_refresh:"true",
        scale:"2",
        size:"4000x300",
        markers: "size:small%7Ccolor:0xff0000%7C",
        label :"",
        zoom :13, 
        url: ""
    };
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
View.prototype.updateNewInputValues = function(){
    this.addUsernameVal =  document.getElementById("newUsername").value;
    this.addUserRoleVal = document.getElementById("newRole").value;
    this.model.addUser();
};
View.prototype.toggleAddUser = function(){
    this.addUsername.toggleClass("hidden");
    this.addUserRole.toggleClass("hidden");
};
View.prototype.showAddGameModule = function(){
    this.addGameModule.toggleClass("hidden");
    var that = this;
    $('#addGameModule #datepicker').pikaday({ 
        firstDay: 1,
        onSelect: function() {
            that.addGameDate = document.createTextNode(this.getMoment().format('YYYY MM DD'));
        }
    }); 
};
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
    this.addGameOpponent = "";
    this.addGameTime = "";
    this.addGameLocation = "";
    document.getElementById("datepicker").value = "";
};
View.prototype.toggleLogin = function(){
    this.username.toggleClass("hidden");
    this.password.toggleClass("hidden");
    this.submitLogin.toggleClass("hidden");
};

View.prototype.onNewUserLogIn = function() {
    console.log("welcome new user");
    //notify that password has been saved
    this.message.text("Welcome! Your password has been saved");
    this.showLoggedIn();
};
//e.g. "https://maps.googleapis.com/maps/api/staticmap?center=Sacramento,+CA&maptype=terrain&visual_refresh=true&scale=2&size=4000x300&markers=size:small%7Ccolor:0xff0000%7Clabel:1%7CSacramento&zoom=13"
View.prototype.makeMapUrl = function(){
    this.staticMap.url = this.staticMap.base+"center"+this.staticMap.center+"&maptype="+this.staticMap.terrain+"&visual_refresh="+this.staticMap.visual_refresh+"&scale="+this.staticMap.scale+"&size="+this.staticMap.size+"&markers="+this.staticMap.markers+"label:"+this.staticMap.label+"&zoom="+this.staticMap.zoom;
    return this.staticMap.url; //in controller, pass this.url into $("#map").css("background-image", url());
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
};

View.prototype.notLoggedIn = function(){
    this.message.text("try again");
}

View.prototype.userAdded = function() {
    console.log("added user");
    this.toggleAddUser();
    this.addUsernameVal.text("");
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


