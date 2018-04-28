const config = require('./config')
const mongoose = require('mongoose')

module.exports = function() {
    mongoose.set('debug', config.debug)
    mongoose.Promise = global.Promise
    let db = mongoose.connect(config.mongoUri, { useMongoClient: true })

    require('../app/models/user.model')
    require('../app/models/package.model')
    require('../app/models/company.model')
    require('../app/models/history.model')
    require('../app/models/favorite.model')
    require('../app/models/dictionary.model')
    require('../app/models/image.model')
    require('../app/models/bookmark.model')
    require('../app/models/state.model')
    require('../app/models/recommend.model')

    return db
}