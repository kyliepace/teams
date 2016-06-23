var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
//var async = require('async');
//var socketio = require('socket.io');
var express = require('express');
var app = express(); 
var router = express.Router();  //do I need this?
//var server = http.createServer(router);
//var io = socketio.listen(server);
var BasicStrategy = require('passport-http').BasicStrategy;
var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
var passport = require("passport");
var Users = require('./user_model.js');
var Games = require("./game_model.js");


app.use(express.static(path.resolve(__dirname, 'client')));
//app.use(express.static('client'));
app.use(bodyParser.json());
app.use(passport.initialize());

/////////// CHECK PASSWORD UPON SIGN-IN ///////////
var strategy = new BasicStrategy(function(username, password, callback) {
    Users.findOne({username: username}, function (err, user) {
        if (err) {
            callback(err);
            return;
        }
        if (!user) {
            return callback(null, false, {
                message: 'no user exists with that email address'
            });
        }
        //user.validatePassword checks hashed password.
        user.validatePassword(password, function(err, isValid) {
            if (err) {
                return callback(err);
            }

            if (!isValid) {
                return callback(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return callback(null, user);  //what is the callback?
        });
    });
});

passport.use(strategy);

/////////// GET LIST OF USERS //////////////
app.get('/users', function(req, res) {
    Users.find(function(err, users) {
        if (err) {
            errback(err);
            return;
        }
        res.status(200).json(users);
    },
    function(err) {
        res.status(400).json(err);
    });
});

////////// GET LIST OF GAMES //////////
app.get("/games", function(req, res){
  Games.find(function(err, games){
    if(err){
      errback(err);
      return;
    }
    res.status(200).json(games);
  },
  function(err){
    res.status(400).json(err);
  });
});

///////// LOG IN /////
app.use(passport.initialize());
/* Handle Login  */
app.get('/login', passport.authenticate('strategy', {
    session: true,
    //successRedirect: '/home',
    //failureRedirect: '/',
    //failureFlash : true 
  }), function(req, res){
    res.json({status: "success" });
  });

/////////////  CREATE A USER WITH A USERNAME AND ROLE /////////////////
app.post('/users', function(req, res) {
    //define function
    Users.save= function(username, role, callback, errback){
      Users.create({username: username, role: role}, function(err, user){
        if(err){
          errback(err);
          return;
        }
        callback(user);
      });
    };
    //invoke function passing in args from req
    Users.save(req.body.username, req.body.role, function(user){
      res.status(201).json(user); //callback
    }, function(err){
      res.status(400).json(err); //errback
    });
});

///////////// CREATE A GAME /////////////////
app.post("/games", function(req, res){
  Games.save = function(opponent, date, time, location, ourScore, theirScore, callback, errback){
    Games.create({opponent: opponent, date: date, location: location, ourScore: ourScore, theirScore: theirScore}, function(err, game){
      if(err){
        errback(err);
        return;
      }
      callback(game);
    });
  };
  Games.save(req.body.opponent, req.body.date, req.body.time, req.body.location, req.body.ourScore, req.body.theirScore, function(game){
    res.status(201).json(game);
  }, function(err){
    res.status(400).json(err);
  });
});

///////// UPDATE A USER BY ADDING A PASSWORD //////////
app.put("/users/:id", function(req, res){
  //1. define updateUser function
    Users.updateUser = function(id, password, callback, errback){
        Users.findById(id, function(err, user){
          user.update({password: password}, function(err, user){ 
            if (err){
              errback(err);
              return;
            }
            callback(user);
          });
        });
    };
    //2. hash password and call updateUser
    var pass = req.body.password;
    //pass.trim();
    bcrypt.genSalt(10, function(err, salt){
      if(err){
        return res.status(500).json({message: "Internal server error"});
      }
      bcrypt.hash(pass, salt, function(err, hash) {
        if (err) {
          return res.status(500).json({
            message: 'Internal server error'
          });
        }
        Users.updateUser(req.body._id, hash, function(user){
            res.status(200).json(user);
          }, function(err){
            res.status(400).json(err);
          }
        );
      });
    });
});


////////////// UPDATE A GAME /////////////
app.put("/games/:id", function(req, res){
    var _id = req.body._id;
    Games.updateGame = function(id, opponent, date, time, location, ourScore, theirScore, callback, errback){
      Games.findById(id, function(err, game){
        game.update({opponent: opponent, date: date, time: time, location: location, ourScore: ourScore, theirScore:theirScore}, function(err, game){
          if(err){
            errback(err);
            return;
          }
          callback(game);
        });
      });
    };
    Games.updateItem(req.body._id, req.body.opponent, req.body.date, req.body.time, req.body.location, req.body.ourScore, req.body.theirScore, function(item){ 
        res.status(200).json(item);
    }, function(err){
        res.status(400).json(err);
    });
});


/*
var messages = [];
var sockets = [];


io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}
*/
// server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
//   var addr = server.address();
//   console.log("Server listening at", addr.address + ":" + addr.port);
// });

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
});
