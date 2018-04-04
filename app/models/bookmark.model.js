const mongoose = require('mongoose')
const Schema = mongoose.Schema

let BookmarkSchema = new Schema({
    email: String,
    packageId: { type: Schema.ObjectId, ref: 'Package' },
    bookmark: Boolean,
    updated: {
        type: Date,
        default: Date.now
    }
},
{
    toJSON: {virtuals:true} 
})

BookmarkSchema.virtual('user', {
    ref: 'User',
    localField: 'email',
    foreignField: 'email',
    justOne: true
});
  
mongoose.model('Bookmark', BookmarkSchema)
