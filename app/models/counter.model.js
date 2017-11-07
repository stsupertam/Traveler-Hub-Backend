var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterSchema = new Schema({
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