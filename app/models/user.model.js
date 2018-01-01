var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: String,
    usertype: String,
    created: {
        type: Date,
        default: Date.now
    }
});

UserSchema.virtual('customers', {
    ref: 'Customer',
    localField: 'username',
    foreignField: 'username',
});

UserSchema.virtual('employees', {
    ref: 'Employee',
    localField: 'username',
    foreignField: 'username',
});

mongoose.model('User', UserSchema)