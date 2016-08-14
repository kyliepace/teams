var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
//mongoose.connect('mongodb://kyliepace:poland07@ds021994.mlab.com:21994/teams');

var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/mongo_data';

//mongoose.connect("mongodb://localhost/mongo_data");
mongoose.connect(uristring, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
      console.log ('Succeeded connected to: ' + uristring);
      }
    });
mongoose.connection.on('error', function(err) {
    console.error('Could not connect.  Error:', err);
});


var usersSchema = mongoose.Schema({
       username: {type: String, unique: true, required: true},
       password: {type: String, unique: false, required: false},
       role: {type: String, unique: false}
    });
    
usersSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isValid) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isValid);
    });
};

var Users = mongoose.model('Users', usersSchema);

module.exports = Users;