const mongoose = require('mongoose')
const Schema = mongoose.Schema

var HistorySchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    packageId: [{ type: Schema.ObjectId, ref: 'Package' }]
})

mongoose.model('History', HistorySchema)