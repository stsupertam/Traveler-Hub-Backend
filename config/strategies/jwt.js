const passportJWT = require('passport-jwt')
const mongoose = require('mongoose')
const passport = require('passport')
const { JWT_SECRET } = require('../config')
const JWTStrategy   = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt


module.exports = function() {
    let User = mongoose.model('User')
    passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey   : JWT_SECRET 
        },
        function (jwtPayload, done) {
            return User.findOne({ email: jwtPayload.email }).select('-password')
                .populate('profileImage', 'filename -_id')
                .lean()
                .then((user) => {
                    return done(null, user)
                })
                .catch((err) => {
                    return done(err)
                })
        }
    ))
}
