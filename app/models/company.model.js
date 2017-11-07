var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
    company_id: Number,
    company_name: String,
    address: String, 
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Company', CompanySchema)