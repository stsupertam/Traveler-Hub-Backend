const passport = require('passport');
const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy;

module.exports = function() {
    var User = mongoose.model('User')
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        }, 
        function (username, password, done) {
            return User.findOne({ username })
                .then((user) => {
                    if (!user) {
                       return done(null, false, {message: 'Incorrect email or password.'});
                    }
                    return done(null, user.toJSON(), {message: 'Logged In Successfully'});
                }).catch(err => done(err));
        }
    ));
}
