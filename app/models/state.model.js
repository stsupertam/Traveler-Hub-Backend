const mongoose = require('mongoose')
const Schema = mongoose.Schema

let StateSchema = new Schema({
    userId: {
        type: String,
        unique: true
    },
    latestMessage: {
        type: String,
        default: ''
    },
    state: String,
})

mongoose.model('State', StateSchema)