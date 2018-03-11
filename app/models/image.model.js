const mongoose = require('mongoose')
const Schema = mongoose.Schema

var ImageSchema = new Schema({
    filename: String,
    path: String,
    mimetype: String,
    size: Number
})

mongoose.model('Image', ImageSchema)