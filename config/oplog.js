const MongoOplog = require('mongo-oplog')
const config = require('./config')
const oplog = MongoOplog(config.mongoLocalUri)
const Package = require('mongoose').model('Package')

function reindex(model){
  var stream = model.synchronize()
  var count = 0

  stream.on('data', function(err, doc){
      count++
  })
  stream.on('close', function(){
      console.log('indexed ' + count + ' documents!')
  })
  stream.on('error', function(err){
      console.log(err)
  })
}
 
module.exports = function() {
    oplog.tail()
    oplog.on('insert', doc => {
        reindex(Package)
        console.log('Insert')
    })
    oplog.on('update', doc => {
        reindex(Package)
        console.log('Update')
    })
    oplog.on('delete', doc => {
        reindex(Package)
        console.log('Delete')
    })
    oplog.on('error', error => {
        console.log(error)
    })
    oplog.on('end', () => {
        console.log('Stream ended')
    })
    oplog.stop(() => {
        console.log('server stopped')
    })
}
