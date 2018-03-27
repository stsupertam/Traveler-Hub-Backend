const mongoose = require('mongoose')
const Schema = mongoose.Schema

let CompanySchema = new Schema({
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