var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterSchema = new Schema({
    active: {
        type: Number, 
        default: 1
    },
    company_id: {
        type: Number,
        default: 0
    },
    package_id: {
        type: Number,
        default: 0
    }
});

mongoose.model('Counter', CounterSchema)