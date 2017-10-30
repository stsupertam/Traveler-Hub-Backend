var User = require('mongoose').model('User');

exports.create = function(req, res, next) {
    var user = new User(req.body);

    user.save(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(user);
        }

    });
};

exports.list = function(req, res, next) {
    User.find({}, function(err, users) {
        if (err) {
            return next(err);
        } else {
            res.json(users);
        }

    });
};

exports.delete = function(req, res, next) {
    req.user.remove(function(err) {
        if (err) {
            return next()
        } else {
            res.json(req.user);
        }
    });
};
exports.update = function(req, res, next) {
    User.findOneAndUpdate({username: req.user.username}, req.body,
        function(err, user) {
            if (err) {
                return next(err);
            } else {
                res.json(user);
            }
    });
};

exports.read = function(req, res) {
    res.json(req.user);
};

exports.userByUsername = function(req, res, next, username) {
    User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            return next(err);
        } else {
            req.user = user;
            next();
        }
    });
};