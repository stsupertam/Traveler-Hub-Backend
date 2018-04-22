const jwt = require('jsonwebtoken')
const passport = require('passport')
const url = require('url')
const mongoose = require('mongoose')
const User = require('mongoose').model('User')
const Image = require('mongoose').model('Image')
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
        req.login(user, {session: false}, async (err) => {
            if (err) {
                res.send(err)
            }
            let image = await Image.findById(mongoose.Types.ObjectId(user.profileImage))
            if(image) {
                user.profileImage = '/images/' + image.filename
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
        req.body.usertype = 'customer'
        req.body.facebookID = req.body.userID 
        user = new User(req.body)
        user['password'] = randomstring.generate(16)
        user.validate()
            .then(() => {
                return user.save()
            })
            .then(() => {
                return user.populate('profileImage', 'path -_id').execPopulate()
            })
            .then((user) => {
                let userCopy = JSON.parse(JSON.stringify(user))
                delete userCopy['password']
                userCopy.profileImage = user.profileImage.path
                token = jwt.sign(userCopy, JWT_SECRET)
                return res.json({ userCopy, token })
            })
            .catch((err) => {
                return res.status(422).json(err['errors'])
            })
    }
}

exports.verifySignature = function(req, res, next) {
    passport.authenticate('jwt', {session: false}, async (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info,
                user   : user
            })
        }
        if(req.path === '/auth') {
            if(user.profileImage) {
                if(user.facebookID) {
                    user.profileImage = user.profileImage.path
                } else {
                    user.profileImage = '/images/' + user.profileImage.filename
                }
            }
            return res.json(user)
        } else if(req.path === '/history/report') {
            if(user.usertype != 'agency') {
                return res.status(422).json({
                    error: 'You don\'t have permission to access this site.'
                })
            }
        }
        req.user = user
        return next()
    })(req, res, next)
}