const mongoose = require('mongoose')
const Schema = mongoose.Schema

let HistorySchema = new Schema({
    email: String,
    packageId: { type: Schema.ObjectId, ref: 'Package' },
    created: {
        type: Date,
        default: Date.now
    }
},
{
    toJSON: {virtuals:true} 
})

HistorySchema.virtual('user', {
    ref: 'User',
    localField: 'email',
    foreignField: 'email',
    justOne: true
})

mongoose.model('History', HistorySchema)