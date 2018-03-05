const passport = require('passport')

module.exports = function(app) {
    var user = require('../controllers/user.controller')
    var auth = require('../controllers/auth.controller')
    app.route('/user')
        .post(user.create)
        .get(user.list)
    app.route('/user/:email')
        .get(auth.verifySignature, user.read)
        .put(auth.verifySignature, user.update)
        .delete(auth.verifySignature, user.delete)
    app.param('email', user.userByEmail)
}