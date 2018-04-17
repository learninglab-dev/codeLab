var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    given_name : String,
    family_name: String,
    sub: String,
    email: String,
    token: String
}, {strict: false});

module.exports = mongoose.model('user', UserSchema );
