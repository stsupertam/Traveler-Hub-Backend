const User = require('mongoose').model('User')
const Package = require('mongoose').model('Package')
const History = require('mongoose').model('History')
const passport = require('passport')
const _ = require('lodash')

exports.updateView = function(req, res, next) {
    console.log('In updateView')
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if(err || !user) {
            console.log(err)
            return next()
        } else {
            console.log(user.email)
            console.log(req.package._id)
            History.findOne({ email: user.email})
                .then((history) => {
                    if(!history) {
                        history = new History({ email: user.email, packageId: req.package._id })
                        history.save()
                            .then(next())
                            .catch((err) => {
                                return next(err)
                            })
                    } else {
                        history.packageId.addToSet(req.package._id)
                        history.save()
                            .then(next())
                            .catch((err) => {
                                return next(err)
                            })
                    }
                }).catch((err) => {
                    return next(err)
                })
        }
    })(req, res, next)
}