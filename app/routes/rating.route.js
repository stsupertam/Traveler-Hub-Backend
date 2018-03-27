const passport = require('passport')

module.exports = function(app) {
    let favorite = require('../controllers/favorite.controller')
    let auth = require('../controllers/auth.controller')
    app.route('/rate')
        .put(auth.verifySignature, favorite.ratePackage)
}