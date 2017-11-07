var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PackageSchema = new Schema({
    package_id: {
        type: Number,
        unique: true
    },
    company_id: Number,
    package_name: String,
    location: String,
    province: String,
    detail: String,
    price: Number,
    image: String,
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
}, { toJSON: { virtuals: true } });

PackageSchema.virtual('company', {
    ref: 'Company',
    localField: 'company_id',
    foreignField: 'company_id',
    justOne: true
});

mongoose.model('Package', PackageSchema)