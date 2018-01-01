var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    firstname: String,
    lastname: String,
    username: {
        type: String,
        ref: 'User',
        unique: true
    },
    age: Number,
    gender: String,
    address: String,
    country: String,
    province: String,
    phonenumber: String,
    creditcard: Number,
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Customer', CustomerSchema)
