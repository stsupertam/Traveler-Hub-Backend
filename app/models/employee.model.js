var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var EmployeeSchema = new Schema({
    company_name: {
        type: String,
        ref: 'Company'
    },
    firstname: {
        type: String,
        required: [true, 'Firstname field is required']
    },
    lastname: {
        type: String,
        required: [true, 'Lastname field is required']
    },
    age: {
        type: String,
        required: [true, 'Age field is required']
    },
    gender: {
        type: String,
        required: [true, 'Gender field is required']
    },
    country: {
        type: String,
        required: [true, 'Country field is required']
    },
    province: {
        type: String,
        required: [true, 'Province field is required']
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Username field is required'],
        ref: 'User'
    },
    phonenumber: String,
    creditcard: Number,
    created: {
        type: Date,
        default: Date.now
    }
});

EmployeeSchema.plugin(uniqueValidator);
mongoose.model('Employee', EmployeeSchema)