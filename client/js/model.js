//send request to google

var Model = function(){
    this.args = {
                center: "",
                maptype: "roadmap",
                zoom:15,
                markers: {size:"mid",color: , label:},
                key: "AIzaSyC2fIsU3BE1FtGxOVoApV-qE33U0d01dzo"
    };
    this.url = "https://maps.googleapis.com/maps/api/";
};

Model.prototype.googleApi = function(extension, args){
    //var screenSize = get width dimension
    this.args.size= screensize+"x300"; 
    //make a request that passes the url+extension and args to google
    //or just return the https:// address
};


//in controller, we will call model.googleApi("staticmap", model.args);
// model.args.center = nextGame.location
//$("#map").css("background-image", "url("+Model.googleApi+")");
