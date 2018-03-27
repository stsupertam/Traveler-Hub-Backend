const passport = require('passport')

module.exports = function(app) {
    let user = require('../controllers/user.controller')
    let auth = require('../controllers/auth.controller')
    app.route('/user')
        .post(user.create)
        //.get(user.list)
    app.route('/user/:email')
        .get(auth.verifySignature, user.read)
        .put(auth.verifySignature, user.update)
        .delete(auth.verifySignature, user.delete)
    app.param('email', user.userByEmail)
}