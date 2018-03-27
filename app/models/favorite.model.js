const mongoose = require('mongoose')
const Schema = mongoose.Schema

let FavoriteSchema = new Schema({
    email: String,
    packageId: { type: Schema.ObjectId, ref: 'Package' },
    like: Boolean,
    created: {
        type: Date,
        default: Date.now
    }
},
{
    toJSON: {virtuals:true} 
})

FavoriteSchema.virtual('user', {
    ref: 'User',
    localField: 'email',
    foreignField: 'email',
    justOne: true
});
  
mongoose.model('Favorite', FavoriteSchema)