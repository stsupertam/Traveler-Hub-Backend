var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    username: {type: String, unique: true},
    email: {type: String, index: true},
    password: String,
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('User', UserSchema)