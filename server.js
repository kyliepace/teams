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


app.use(express.static(path.resolve(__dirname, 'client')));
//app.use(express.static('client'));
app.use(bodyParser.json());
app.use(passport.initialize());

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

/////////////  CREATE A USER WITH A USERNAME AND ROLE /////////////////
app.post('/items', function(req, res) {
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
      res.status(400).json(user); //errback
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
