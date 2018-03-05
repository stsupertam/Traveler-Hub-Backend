const mongoose = require('mongoose')
const Schema = mongoose.Schema

var RatingSchema = new Schema({
    email: String,
    packageId: Schema.ObjectId,
    rating: Number
})

mongoose.model('Rating', RatingSchema)
