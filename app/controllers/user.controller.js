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
            const token = jwt.sign(req.body, JWT_SECRET)
            user.save()
            return res.json({ message: 'Register Successfully', token: token })
        })
        .catch((err) => {
            console.log(req.body)
            console.log(err)
            return res.status(422).json(err['errors'])
        })
}

exports.list = function(req, res, next) {
    User.find({}).select('-_id -__v -created')
        .populate('profileImage', 'path -_id')
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
        .then((user) => {
            return res.json(user)
        })
        .catch((err) => {
            return res.json(err)
        })
}

exports.read = function(req, res) {
    return res.json(req.user)
}

exports.userByEmail = function(req, res, next) {
    User.findOne({ email: req.user.email }).select('-_id -__v -created')
        .populate('profileImage', 'path -_id')
        .then((user) => {
            req.user = user
            return next()
        })
        .catch((err) => {
            return next(err)
        })
}