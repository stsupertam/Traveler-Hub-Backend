const passport = require('passport')

module.exports = function(app) {
    var favorite = require('../controllers/favorite.controller')
    var auth = require('../controllers/auth.controller')
    app.route('/favorite')
        //.put(favorite.likeDislike)
        //.get(favorite.display)
        .put(auth.verifySignature, favorite.likeDislike)
        .get(auth.verifySignature, favorite.display)
}