var Users = require('./user_model.js');
var Games = require('./game_model.js');

exports.run = function(callback, errback) {
    Users.create({username: 'a', role: "manager"}, function(err, users) {
        if (err) {
            errback(err);
            return;
        }
        callback(users);
    });
    
    Games.create({opponent: "Lions", date: "July 6, 2016", time: "4pm", location: "Sacramento"}, function(err, games){
        if (err) {
            errback(err);
            return;
        }
        callback(games);
    });
};

// if (require.main === module) {
//     require('./connect');
//     exports.run(function() {
//         var mongoose = require('mongoose');
//         mongoose.disconnect();
//     }, function(err) {
//         console.error(err);
//     });
// }