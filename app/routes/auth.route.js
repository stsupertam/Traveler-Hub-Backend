const passport = require('passport')

module.exports = function(app) {
    var auth = require('../controllers/auth.controller')
    app.route('/login')
        .post(auth.login)
    app.route('/auth')
        .get(auth.verifySignature)
    app.route('/auth/facebook')
        .post(auth.facebook)
}