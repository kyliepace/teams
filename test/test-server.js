var chai = require('chai');
var chaiHttp = require('chai-http');
global.environment = 'test';
var server = require('../server.js');
var Users = require('../user_model.js');
var Games = require("../game_model.js");
var seed = require('../seed.js');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Users', function() {
    // before(function(done) {
    //     Users.create({username: 'a', role: "manager"}, function(err, users) {
    //         if (err) {
    //             errback(err);
    //             return;
    //         }
    //         //callback(users);
    //     });
    // });
    
    after(function(done) {
        Users.remove(function() {
            done();
        });
    });
    it('should add a user on POST', function(done) {
        chai.request(app)
            .post('/users')
            .send({'username': 'address@gmail.com', "role": "player"})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.username.should.be.a('string');
                res.body.username.should.equal('address@gmail.com');
                done();
            });
    });
    it('should edit a user on put', function(done){
        Users.findOne({username: 'address@gmail.com'}, function(err, user) {
            if(err) {
                return;
            }
        
        chai.request(app)
            .put("/users/"+user._id)
            .send({"_id": user._id, "password":"aPassword"})
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(200);
                user.should.be.a("object");
                done();
            });
        });
    });

    it("should list users on GET", function(done){ 
        chai.request(app) //chai makes a request to my app
            .get("/users") //make a request to the /users endpoint
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('username');
                res.body[0].username.should.equal('address@gmail.com');
                done();
            });
    });
});


describe('Games', function() {
    // before(function(done) {
    //     Games.create({opponent: "Lions", date: "July 6, 2016", time: "4pm", location: "Sacramento"}, function(err, games){
    //         if (err) {
    //             errback(err);
    //             return;
    //         }
    //         //callback(games);
    //     });
    // });
    
    after(function(done) {
        Games.remove(function() {
            done();
        });
    });
    
    it('should add a game on POST', function(done) {
        chai.request(app)
            .post('/games')
            .send({'opponent': 'Tigers',"date": "08/01/2016", "time": "4pm","location": ""})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.opponent.should.be.a('string');
                res.body.opponent.should.equal('Tigers');
                done();
            });
    });
    it("should list games on GET", function(done){ 
        chai.request(app) //chai makes a request to my app
            .get("/games") //make a request to the /items endpoint
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                done();
            }); 
    });

    it('should delete a game on delete', function(done){
        Games.findOne({opponent: 'Tigers'}, function(err, game) {
            if(err) {
            return;
            }
            chai.request(app)
            .delete("/games/" + game._id)
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(200);
                res.body.should.be.a("object");
                done();
            });
        });
    });
});