const passport = require('passport');

module.exports = function(app) {
    var auth = require('../controllers/auth.controller');
    app.route('/login')
        .post(auth.login);
    app.route('/auth')
        .get(auth.verifySignature);
    app.route('/auth/facebook')
        .post(auth.facebook);
    //app.route('/auth/facebook')
    //    .get(passport.authenticate('facebook', { scope: ['public_profile', 'email']}));
    //app.route('/auth/facebook/callback')
    //    .get(auth.facebook);

};