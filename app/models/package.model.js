var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var TimelineSchema = new Schema({
    day: Number,
    description: [
        {
            time: String,
            activity: String
        }
    ]
});

var PackageSchema = new Schema({
    package_id: {
        type: Number,
        unique: true,
        required: [true, 'Package_id field is required']
    },
    company_name: {
        type: String,
        required: [true, 'Company_name field is required'],
        ref: 'Company'
    },
    package_name: String,
    location: String,
    province: String,
    detail: String,
    price: Number,
    image: String,
    rating: Number,
    human_price: String,
    travel_date: String,
    timeline: [TimelineSchema],
    travel_duration: {
        type: Number,
        default: 1
    },
    start_travel_date: {
        type: Date,
        default: Date.now
    },
    number_of_views: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    }
});

PackageSchema.plugin(uniqueValidator);
PackageSchema.index({ package_name: 'text' });
mongoose.model('Package', PackageSchema)