const mongoose = require('mongoose')
const mongoosastic = require('mongoosastic')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

var TimelineSchema = new Schema({
    day: Number,
    detail: String,
    description: [
        {
            time: String,
            activity: String
        }
    ]
})

var PackageSchema = new Schema({
    company: {
        type: String,
        es_indexed: true,
        required: [true, 'Company field is required'],
        ref: 'Company'
    },
    package_name: String,
    url: String,
    logo: String,
    detail: String,
    price: {
        type: Number,
        es_indexed: true
    },
    image: String,
    rating: {
        type: Number,
        es_indexed: true
    },
    human_price: String,
    travel_date: String,
    region: {
        type: String,
        es_indexed: true
    },
    travel_types: [String],
    timeline: [TimelineSchema],
    provinces: {
        type: [String],
        es_indexed: true
    },
    tags: {
        type: [String],
        es_indexed: true
    },
    text: {
        type: [String],
        es_indexed: true
    },
    travel_duration: {
        type: Number,
        default: 1
    },
    start_travel_date: {
        type: Date,
        es_indexed: true,
        default: null
    },
    end_travel_date: {
        type: Date,
        es_indexed: true,
        default: null
    },
    number_of_views: {
        type: Number,
        es_indexed: true,
        default: 0
    },
    quantity: {
        type: Number,
        es_indexed: true,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    }
}, { toJSON: { virtuals: true } })

PackageSchema.plugin(uniqueValidator)
PackageSchema.plugin(mongoosastic, {hydrate:true, hydrateOptions: { select: '-text' }}) 

mongoose.model('Package', PackageSchema)
var Package = mongoose.model('Package', PackageSchema)
var stream = Package.synchronize()
var count = 0

stream.on('data', function(err, doc){
    count++
})
stream.on('close', function(){
    console.log('indexed ' + count + ' documents!')
})
stream.on('error', function(err){
    console.log(err)
})
