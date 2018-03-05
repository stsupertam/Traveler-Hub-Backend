const mongoose = require('mongoose')
const Schema = mongoose.Schema

var CompanySchema = new Schema({
    company_id: { 
        type: Number, 
        unique: true 
    },
    company_name: { 
        type: String, 
        unique: true 
    },
    address: String, 
    created: { 
        type: Date, 
        default: Date.now 
    }
})

mongoose.model('Company', CompanySchema)