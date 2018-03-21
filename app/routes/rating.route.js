const passport = require('passport')

module.exports = function(app) {
    var favorite = require('../controllers/favorite.controller')
    var auth = require('../controllers/auth.controller')
    app.route('/rate')
        .put(auth.verifySignature, favorite.ratePackage)
}