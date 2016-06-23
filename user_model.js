var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
//mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds021994.mlab.com:21994/teams');
mongoose.connect("mongodb://localhost/mongo_data");
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