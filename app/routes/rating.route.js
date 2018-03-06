const passport = require('passport')

module.exports = function(app) {
    var rating = require('../controllers/rating.controller')
    var auth = require('../controllers/auth.controller')
    app.route('/rate')
        .put(auth.verifySignature, rating.ratePackage)
}