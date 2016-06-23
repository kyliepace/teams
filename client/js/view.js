//send request to google

var View = function(){
    this.model;
    this.upcomingGamesDiv = $('#upcoming .games');
    this.game = $(".game");
    this.addGameButton = $('#addGameButton');
    this.addGameButton.on("click", this.showAddGameModule.bind(this));
    this.addGameModule = $("#addGameModule");
    this.addGameOpponent = $("#addGameModule .opponent").val();
    this.addGameDate = $("#addGameModule .date").val();
    this.addGameTime = $("#addGameModule .time").val();
    this.addGameLocation = $("#addGameModule .location").val();
    this.addGameOurScore = $("#addGameModule .ourScore").val();
    this.addGameTheirScore =$("#addGameModule .theirScore").val();
    this.submitAddGame = $("#addGameModule .submitAddGame");
    this.login = $("header div h5.login");
    this.login.on("click", this.toggleLogin.bind(this));
    
    this.username = $("#username");
    this.password = $("#password");
    this.submitLogin = $('#submitLogin');
    this.passwordInput = $("header div .login");
    this.message = $("#message");
    this.addUserButton = $("header h5.addUser");
    this.addUsername = $("header username.addUser").val();
    this.addUserRole = $("header select").val();
    this.submitNewUser = $("#submitNewUser");
    
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

//View.prototype.submitLoginOnClick = function(){
    //console.log(this.usernameVal);
    //var that = this;
    //this.model.checkIfPassword(that.usernameVal, that.passwordVal);
//};
View.prototype.showAddGameModule = function(){
    this.addGameModule.toggleClass("hidden");
};
View.prototype.toggleLogin = function(){
    this.username.toggleClass("hidden");
    this.password.toggleClass("hidden");
    this.submitLogin.toggleClass("hidden");
};
//e.g. "https://maps.googleapis.com/maps/api/staticmap?center=Sacramento,+CA&maptype=terrain&visual_refresh=true&scale=2&size=4000x300&markers=size:small%7Ccolor:0xff0000%7Clabel:1%7CSacramento&zoom=13"
View.prototype.makeMapUrl = function(){
    this.staticMap.url = this.staticMap.base+"center"+this.staticMap.center+"&maptype="+this.staticMap.terrain+"&visual_refresh="+this.staticMap.visual_refresh+"&scale="+this.staticMap.scale+"&size="+this.staticMap.size+"&markers="+this.staticMap.markers+"label:"+this.staticMap.label+"&zoom="+this.staticMap.zoom;
    return this.staticMap.url; //in controller, pass this.url into $("#map").css("background-image", url());
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


