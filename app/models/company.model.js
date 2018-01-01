var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
    company_name: { 
        type: String, 
        unique: true 
    },
    address: String, 
    created: { 
        type: Date, 
        default: Date.now 
    }
}, { toJSON: { virtuals: true } });

CompanySchema.virtual('packages', {
    ref: 'Package',
    localField: 'company_name',
    foreignField: 'company_name',
});

mongoose.model('Company', CompanySchema)