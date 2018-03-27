const User = require('mongoose').model('User')
const Package = require('mongoose').model('Package')
const History = require('mongoose').model('History')
const passport = require('passport')

exports.updateHistory = function(req, res, next) {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if(err || !user) {
            console.log(err)
            return next()
        } else {
            let history = new History({ email: user.email, packageId: req.package._id})
            history.save()
                .then(next())
                .catch((err) => {
                    return next(err)
                })
        }
    })(req, res, next)
}