const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const passport = require('passport');
const randomstring = require('randomstring');
const FacebookStrategy = require('passport-facebook').Strategy;
const { JWT_SECRET } = require('../config')
const { FACEBOOK_APP_ID } = require('../config');
const { FACEBOOK_APP_SECRET } = require('../config');


module.exports = function() {
    var User = mongoose.model('User')
    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: 'http://supertam.xyz:5000/auth/facebook/callback',
        profileFields: ['id', 'email', 'name'],
        passReqToCallback: true
    },
    function(req, token, refreshToken, profile, done) {
        var url = req.headers.referer;
        return User.findOne({ facebookID: profile.id })
            .then((user) => {
                if(user) {
                    user['token'] = jwt.sign(user.toJSON(), JWT_SECRET);
                } else {
                    var user = new User();
                    user['facebookID'] = profile.id;
                    user['facebookToken'] = token;
                    user['firstname'] = profile.name.givenName;
                    user['lastname'] = profile.name.familyName;
                    user['email'] = profile.emails[0].value;
                    user['password'] = randomstring.generate(16);
                    user['token'] = jwt.sign(user.toJSON(), JWT_SECRET)
                    user.save();
                }
                return done(null, user, { url: url });
            }).catch((err) => {
                console.log(err)
                return done(null, err)
            });
    }
    ));
}
