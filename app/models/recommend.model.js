const mongoose = require('mongoose')
const mongoosastic = require('mongoosastic')
const Schema = mongoose.Schema

let RecommendSchema = new Schema({
    email: String,
    package_likes: {
        type: [ Schema.ObjectId ],
        es_indexed: true
    },
},{ usePushEach: true })

RecommendSchema.plugin(mongoosastic, { hydrate:true }) 

mongoose.model('Recommend', RecommendSchema)
let Recommend = mongoose.model('Recommend', RecommendSchema)
let stream = Recommend.synchronize()
let count = 0

stream.on('data', function(err, doc){
    count++
})
stream.on('close', function(){
    console.log('Recommend: indexed ' + count + ' documents!')
})
stream.on('error', function(err){
    console.log(err)
})
