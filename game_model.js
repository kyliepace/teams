var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/');

mongoose.connection.on('error', function(err) {
    console.error('Could not connect.  Error:', err);
});

var gamesSchema = mongoose.Schema({
       opponent: {type: String, unique: false, required: false},
       date: {type: String, unique: false, required: true},
       time: {type: String, unique: false, required: false},
       location: {type: String, unique: false, required: false},
       ourScore: {type: Number, unique: false, required: false},
       theirScore: {type: Number, unique: false, required: false}
    });
    
var Games = mongoose.model('Games', gamesSchema);

module.exports = Games;