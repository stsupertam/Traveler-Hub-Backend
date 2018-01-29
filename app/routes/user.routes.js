const passport = require('passport');

module.exports = function(app) {
    var user = require('../controllers/user.controller');
    app.route('/login')
        .post(user.login);
    app.route('/user')
        .post(user.create)
        .get(user.list);
    app.route('/user/:username')
        .get(user.read, passport.authenticate('jwt', {session: false}))
        .put(user.update)
        .delete(user.delete);
    app.param('username', user.userByUsername);
};