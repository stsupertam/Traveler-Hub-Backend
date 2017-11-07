var config = require('./config');
var mongoose = require('mongoose');

module.exports = function() {
    mongoose.set('debug', config.debug);
    mongoose.Promise = global.Promise;
    var db = mongoose.connect(config.mongoUri, { useMongoClient: true });

    require('../app/models/user.model');
    require('../app/models/package.model');
    require('../app/models/company.model');
    require('../app/models/counter.model');

    // init counter
    var Counter = db.model('Counter');
    Counter.count({})
    .then((count) => {
        if (count === 0) {
            console.log('Hello');
            var counter = new Counter();
            counter.save();
        }
    }).catch((err) => {
        return next(err)
    })

    return db;
}