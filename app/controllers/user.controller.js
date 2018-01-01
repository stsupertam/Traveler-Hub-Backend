var User = require('mongoose').model('User');
var Customer = require('mongoose').model('Customer');
var Employee = require('mongoose').model('Employee');

var split_userInfo = function(req) {
    var user = {
        username: req.username,
        email: req.email,
        password: req.password,
        usertype: req.usertype
    };
    var info = {
        username: req.username,
        firstname: req.firstname,
        lastname: req.lastname,
        age: req.age,
        gender: req.gender,
        country: req.country,
        province: req.province,
        phonenumber: req.phonenumber,
    };
    return {
        user: user,
        info: info
    }
}

exports.create = function(req, res, next) {
    var userInfo = split_userInfo(req.body);
    var user_body = userInfo.user;
    var info_body = userInfo.info;
    var user = new User(user_body);
    user.save()
    .then(() => {
        var info = '';
        if(req.body['usertype'] === 'c') {
            var info = new Customer(info_body);
        } else {
            var info = new Employee(info_body);
        }
        return info.save();
    }).then(() => {
        return res.json(req.body);
    }).catch((err) => {
        console.log(err);
        return next(err);
    })
};

exports.list = function(req, res, next) {
    User.find({})
    .select('-_id -__v -created')
    .then((users) => {
        return res.json(users);
    }).catch((err) => {
        return next(err);
    });
};

exports.delete = function(req, res, next) {
    req.user.remove()
    .then(() => {
        return next();
    }).catch((err) => {
        return next(err);
    });
};

exports.update = function(req, res, next) {
    User.findOneAndUpdate({ username: req.package.username }, req.body)
    .then((user) => {
        return res.json(user);
    })
    .catch((err) => {
        return next(err);
    })
};


exports.read = function(req, res) {
    res.json(req.user);
};

exports.userByUsername = function(req, res, next, username) {
    User.findone({ username: username })
    .select('-_id -__v -created')
    .then((user) => {
        return res.json(user)
    }).catch((err) => {
        return next(err);
    });
};