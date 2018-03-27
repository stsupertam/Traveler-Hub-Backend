const mongoose = require('mongoose')
const Schema = mongoose.Schema

let DictionarySchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    regions: [{
        region: String,
        images: [{ 
            type: Schema.ObjectId, 
            ref: 'Image' 
        }],
        provinces: [String]
    }],
    travel_types: [{
        travel_type: String,
        images: [{ 
            type: Schema.ObjectId, 
            ref: 'Image' 
        }],
        items: [String]
    }],
    keywords: [String]
})

mongoose.model('Dictionary', DictionarySchema)