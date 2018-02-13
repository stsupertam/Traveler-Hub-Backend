const User = require('mongoose').model('User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/config')

exports.create = function(req, res, next) {
    var user = new User(req['body']);
    user.validate()
        .then(() => {
            const token = jwt.sign(user.email, JWT_SECRET)
            user.save();
            return res.json({ message: 'Register Successfully', token: token });
        }).catch((err) => {
            return res.status(422).json(err['errors']);
        });
};

exports.list = function(req, res, next) {
    User.find({}).select('-_id -__v -created')
        .then((users) => {
            return res.json(users);
        })
        .catch((err) => {
            return next(err);
        });
};

exports.delete = function(req, res, next) {
    req.user.remove()
        .then(() => {
            return next();
        })
        .catch((err) => {
            return next(err);
        });
};

exports.update = function(req, res, next) {
    User.findOneAndUpdate({ email: req.user.email }, req.body, { runValidators: true })
        .then((user) => {
            return res.json(user);
        })
        .catch((err) => {
            return res.json(err)
        })
};


exports.read = function(req, res) {
    res.json(req.user);
};

exports.userByEmail = function(req, res, next, email) {
    User.findOne({ email: email }).select('-_id -__v -created')
        .then((user) => {
            req.user = user;
            next()
        })
        .catch((err) => {
            return next(err);
        });
};
