const passport = require('passport')

module.exports = function(app) {
    let favorite = require('../controllers/favorite.controller')
    let auth = require('../controllers/auth.controller')
    app.route('/favorite')
        //.put(favorite.likeDislike)
        //.get(favorite.display)
        .put(auth.verifySignature, favorite.likeDislike)
        .get(auth.verifySignature, favorite.display)
}