var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmployeeSchema = new Schema({
    firstName: String,
    lastName: String,
    company_name: {
        type: String,
        ref: 'Company'
    },
    username: {
        type: String,
        ref: 'User',
        unique: true
    },
    password: String,
    age: Number,
    address: String,
    country: String,
    province: String,
    phonenumber: String,
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Employee', EmployeeSchema)
