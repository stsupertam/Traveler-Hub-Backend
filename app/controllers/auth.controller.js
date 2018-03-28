const jwt = require('jsonwebtoken')
const passport = require('passport')
const url = require('url')
const User = require('mongoose').model('User')
const randomstring = require('randomstring')
const { JWT_SECRET } = require('../../config/config')

exports.login = function(req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info,
                user   : user
            })
        }
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err)
            }
            const token = jwt.sign(user, JWT_SECRET)
            return res.json({ user, token })
        })
    })(req, res, next)
}

exports.facebook = function(req, res, next) {
    let token = ''
    let user = req.user
    if(user) {
        token = jwt.sign(user.toJSON(), JWT_SECRET)
        return res.json({ user, token })
    } else {
        user = new User(req.body)
        token = jwt.sign(user.toJSON(), JWT_SECRET)
        user['password'] = randomstring.generate(16)
        user.validate()
            .then(() => {
                return user.save()
            })
            .then(() => {
                return user.populate('profileImage', 'path -_id').execPopulate()
            })
            .then((user) => {
                user = user.toJSON()
                delete user['password']
                return res.json({ user, token })
            })
            .catch((err) => {
                console.log(err)
                return res.status(422).json(err['errors'])
            })
    }
}

exports.verifySignature = function(req, res, next) {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info,
                user   : user
            })
        }
        if(req.url === '/auth') {
            return res.json(user)
        }
        req.user = user
        return next()
    })(req, res, next)
}
