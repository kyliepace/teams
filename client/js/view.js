//send request to google

var staticMap = function(){
    this.base = "https://maps.googleapis.com/maps/api/staticmap?";
    this.center = "";//make sure input string replaces spaces with +
    this.maptype = "terrain";
    this.visual_refresh = "true";
    this.scale = "2";
    this.size= "4000x300";
    this.markers = "size:small%7Ccolor:0xff0000%7C";
    this.label = "";
    this.zoom = 13;
};


//e.g. "https://maps.googleapis.com/maps/api/staticmap?center=Sacramento,+CA&maptype=terrain&visual_refresh=true&scale=2&size=4000x300&markers=size:small%7Ccolor:0xff0000%7Clabel:1%7CSacramento&zoom=13"

staticMap.prototype.makeMapUrl = function(){
    this.url = this.base+"center"+this.center+"&maptype="+this.terrain+"&visual_refresh="+this.visual_refresh+"&scale="+this.scale+"&size="+this.size+"&markers="+this.markers+"label:"+this.label+"&zoom="+this.zoom;
    return this.url; //in controller, pass this.url into $("#map").css("background-image", url());
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


