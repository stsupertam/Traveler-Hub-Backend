const mongoose = require('mongoose')
const Schema = mongoose.Schema

var RatingSchema = new Schema({
    email: { type: String, ref: 'User' },
    packageId: { type: Schema.ObjectId, ref: 'Package' },
    rating: Number
})

mongoose.model('Rating', RatingSchema)
