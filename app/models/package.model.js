var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PackageSchema = new Schema({
    name: String,
    company_name: String,
    price: String,
    travel_date: String,
    image: String,
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Package', PackageSchema)