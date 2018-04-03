const passport = require('passport')

module.exports = function(app) {
    let favorite = require('../controllers/favorite.controller')
    let auth = require('../controllers/auth.controller')
    app.route('/favorite')
        .put(auth.verifySignature, favorite.likeDislike)
    app.route('/favorite/display')
        .get(auth.verifySignature, favorite.display)
}