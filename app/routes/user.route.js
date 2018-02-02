const passport = require('passport');

module.exports = function(app) {
    var user = require('../controllers/user.controller');
    app.route('/user')
        .post(user.create)
        .get(user.list);
    app.route('/user/:username')
        .get(passport.authenticate('jwt', {session: false}), user.read)
        .put(user.update)
        .delete(user.delete);
    app.param('username', user.userByUsername);
};