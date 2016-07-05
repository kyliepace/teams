var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Users = require('../user_model.js');
var Games = require("../game_model.js")
//var seed = require('../seed.js');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Users', function() {
    // before(function(done) {
    //     seed.run(function() {
    //         done();
    //     });
    // });
    
    after(function(done) {
        Users.remove(function() {
            done();
        });
    });
    
    
    //insert tests
    it("should list users on GET", function(done){ 
        chai.request(app) //chai makes a request to my app
            .get("/users") //make a request to the /users endpoint
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('username');
                done();
            }); //.end runs the function that you pass in when the request is complete (so done()?)
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
        Users.findOne({
            username: 'a'
            }, function(err, user) {
            if(err) {
            return;
        }
        
        chai.request(app)
            .put("/items/" + user._id)
            .send({"id": user._id, "password":"aPassword"})
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(200);
                //is user available here because .findOne was called within the test?
                user.should.be.a("object");
                done();
            });
        });
    });
});


describe('Games', function() {
    // before(function(done) {
    //     seed.run(function() {
    //         done();
    //     });
    // });
    
    after(function(done) {
        Games.remove(function() {
            done();
        });
    });
    
    
    //insert tests
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
    it('should add a game on POST', function(done) {
        chai.request(app)
            .post('/games')
            .send({'opponent': 'Lions', "time": "4pm", "date": "", "location": ""})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.opponent.should.be.a('string');
                res.body.opponent.should.equal('Lions');
                done();
            });
    });

    it('should delete a game on delete', function(done){
        Games.findOne({name: 'Lions'}, function(err, game) {
            if(err) {
            return;
            }
            chai.request(app)
            .delete("/items/" + game._id)
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(200);
                res.body.should.be.a("object");
                done();
            });
        });
    });
});