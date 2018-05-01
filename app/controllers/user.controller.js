const User = require('mongoose').model('User')
const Favorite = require('mongoose').model('Favorite')
const Package = require('mongoose').model('Package')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config/config')

exports.create = function(req, res, next) {
    let user = new User(req.body)
    user.validate()
        .then(() => {
            delete req.body.password
            if(req.body.birthdate) {
                user.birthdate = new Date(req.body.birthdate)
            }
            const token = jwt.sign(req.body, JWT_SECRET)
            user.save()
            return res.json({ message: 'Register Successfully', token: token })
        })
        .catch((err) => {
            return res.status(422).json(err['errors'])
        })
}

exports.list = function(req, res, next) {
    User.find({}).select('-_id -__v -created')
        .populate('profileImage', 'path -_id')
        .lean()
        .then((users) => {
            return res.json(users)
        })
        .catch((err) => {
            return next(err)
        })
}

exports.delete = function(req, res, next) {
    req.user.remove()
        .then(() => {
            return next()
        })
        .catch((err) => {
            return next(err)
        })
}

exports.update = function(req, res, next) {
    User.findOneAndUpdate({ email: req.user.email }, req.body)
        .populate('profileImage', 'path -_id')
        .lean()
        .then((user) => {
            if(user.profileImage) {
                user.profileImage = '/images/' + user.profileImage.filename
            }
            return res.json(user)
        })
        .catch((err) => {
            return res.json(err)
        })
}

exports.read = function(req, res, next) {
    User.findOne({ email: req.user.email }).select('-_id -__v -created')
        .populate('profileImage', 'filename path -_id')
        .lean()
        .then((user) => {
            if(user.profileImage) {
                if(user.facebookID) {
                    user.profileImage = user.profileImage.path
                } else {
                    user.profileImage = '/images/' + user.profileImage.filename
                }
            }
            if(user.birthdate) {
                user.birthdate = user.birthdate.getFullYear() + '-' +
                                 ('0' + (user.birthdate.getMonth()+1)).slice(-2) + '-' +
                                 ('0' + user.birthdate.getDate()).slice(-2)
            }
            return res.json(user)
        })
        .catch((err) => {
            return next(err)
        })
}
