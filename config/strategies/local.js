const passport = require('passport');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function() {
    var User = mongoose.model('User')
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, 
        function (email, password, done) {
            return User.findOne({ email: email })
                .then((user) => {
                    if (!user || !bcrypt.compareSync(password, user.password)) {
                        return done(null, false, { message: 'Incorrect email or password.' });
                    }
                    user = user.toJSON();
                    delete user['password']
                    return done(null, user, { message: 'Logged In Successfully' });
                }).catch((err) => done(err));
        }
    ));
}
