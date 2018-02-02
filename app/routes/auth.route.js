const passport = require('passport');

module.exports = function(app) {
    var auth = require('../controllers/auth.controller');
    app.route('/auth/login')
        .post(auth.login);
    app.route('/auth/user')
        .get(auth.getUser);
};