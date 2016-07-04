var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require("passport");
var express = require('express');
var app = express(); 
//var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require("passport-local");
var mongoose = require("mongoose");
var LocalStrategy   = require('passport-local').Strategy;
var Users = require('./user_model.js');
var Games = require("./game_model.js");
var bCrypt = require('bcrypt');
var passport = require('passport');

app.use(express.static(path.resolve(__dirname, 'client'))); //send static files to client
//app.use(express.static('client'));
app.use(bodyParser.json());
app.use(passport.initialize());

passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            // check in mongo if a user with username exists or not
            Users.findOne({ 'username' :  username }, 
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        return done(err);
                    }
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, console.log('message', 'User Not found.'));                 
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, console.log('message', 'Invalid Password')); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user);
                }
            );

        })
);

var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
    
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
 ///////// LOG IN & OUT /////
    /* Handle Login  */
    app.post('/login', passport.authenticate('login', {
        session: true,
        //successRedirect: '/home',
        //failureRedirect: '/',
        //failureFlash : true 
      }), function(req, res){
        res.json({status: "success" });
    });
    /* Handle Logout */
  app.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/'); //send a normal result back instead and locally destroy the session in passport
  });
    
/////// GET LIST OF USERS////////////
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
      Games.save = function(opponent, date, time, location, callback, errback){
        Games.create({opponent: opponent, date: date, location: location}, function(err, game){
          if(err){
            errback(err);
            return;
          }
          callback(game);
        });
      };
      Games.save(req.body.opponent, req.body.date, req.body.time, req.body.location, function(game){
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
        bCrypt.genSalt(10, function(err, salt){
          if(err){
            return res.status(500).json({message: "Internal server error"});
          }
          bCrypt.hash(pass, salt, function(err, hash) {
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
  ////////// DELETE A GAME /////////
  app.delete("/games/:id", function(req, res){
    var _id=req.params.id;
    Games.delete = function(_id, callback, errback){
      Games.findOneAndRemove({_id:_id}, function(err, game){
        if(err){
          errback(err);
          return;
        }
        callback(game);
      });
    };
    Games.delete(_id, function(game){
      res.status(200).json(game);
    }, function(err){
      res.status(400).json(err);
    });
  });





/////[][][][][][][][][][][][][][][][][] run server [][][][][][][][][][][][][][][][]
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("server running");
});

