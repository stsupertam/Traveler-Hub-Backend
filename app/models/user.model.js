var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String, 
        unique: true, 
        required: [true, 'Username field is required']
    },
    email: {
        type: String, 
        unique: true, 
        required: [true, 'Email field is required']
    },
    password: {
        type: String,
        required: [true, 'Password field is required']
    },
    usertype: {
        type: String,
        required: [true, 'Usertype field is required']
    },
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