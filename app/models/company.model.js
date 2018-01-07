var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
    company_name: { 
        type: String, 
        unique: true ,
        required: [true, 'Company_name field is required']
    },
    address: String, 
    created: { 
        type: Date, 
        default: Date.now 
    }
}, { toJSON: { virtuals: true } });

//CompanySchema.virtual('packages', {
//    ref: 'Package',
//    localField: 'company_name',
//    foreignField: 'company_name',
//});

CompanySchema.plugin(uniqueValidator);
mongoose.model('Company', CompanySchema)