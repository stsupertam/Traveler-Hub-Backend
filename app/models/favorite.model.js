const mongoose = require('mongoose')
const Schema = mongoose.Schema

var FavoriteSchema = new Schema({
    email: { type: String, ref: 'User' },
    packageId: { type: Schema.ObjectId, ref: 'Package' },
    like: Boolean
})

mongoose.model('Favorite', FavoriteSchema)