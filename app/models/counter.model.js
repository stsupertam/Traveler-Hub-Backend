const mongoose = require('mongoose');
const Package = require('mongoose').model('Package');
const Schema = mongoose.Schema;

var CounterSchema = new Schema({
    active: {
        type: Number, 
        default: 1
    },
    customer_id: {
        type: Number,
        default: 1
    },
    employee_id: {
        type: Number,
        default: 1
    },
    package_id: {
        type: Number,
        default: 1
    }
});

mongoose.model('Counter', CounterSchema)