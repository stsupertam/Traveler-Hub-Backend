const passport = require('passport')

module.exports = function(app) {
    let auth = require('../controllers/auth.controller')
    let image = require('../controllers/image.controller')
    app.route('/login')
        .post(auth.login)
    app.route('/auth')
        .get(auth.verifySignature)
    app.route('/auth/agency')
        .get(auth.verifySignature)
    app.route('/auth/facebook')
        .post(image.facebookProfileUpload, auth.facebook)
}