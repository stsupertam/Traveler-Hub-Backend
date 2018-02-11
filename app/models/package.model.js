const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

var TimelineSchema = new Schema({
    day: Number,
    detail: String,
    description: [
        {
            time: String,
            activity: String
        }
    ]
});

var PackageSchema = new Schema({
    company: {
        type: String,
        required: [true, 'Company field is required'],
        ref: 'Company'
    },
    package_name: String,
    location: String,
    logo: String,
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
    end_travel_date: {
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
