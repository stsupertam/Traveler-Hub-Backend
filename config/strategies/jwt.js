const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const mongoose = require('mongoose')
const passport = require('passport')
const { JWT_SECRET } = require('../../config/config')


module.exports = function() {
    var User = mongoose.model('User')
    passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey   : JWT_SECRET 
        },
        function (jwtPayload, done) {
            return User.findOne({ email: jwtPayload.email }).select('-password')
                .then((user) => {
                    return done(null, user);
                })
                .catch((err) => {
                    return done(err);
                });
        }
    ));
}
