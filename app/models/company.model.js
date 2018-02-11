const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

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

CompanySchema.virtual('packages', {
    ref: 'Package',
    localField: 'company_name',
    foreignField: 'company',
});

CompanySchema.plugin(uniqueValidator);
mongoose.model('Company', CompanySchema)