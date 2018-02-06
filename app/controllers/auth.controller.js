const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = require('../../config/config')

exports.login = function(req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info,
                user   : user
            });
        }
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            const token = jwt.sign(user, JWT_SECRET);
            return res.json({ user, token });
        });
    })(req, res, next);
};

exports.facebook = function(req, res, next) {
    passport.authenticate('facebook', {session: false}, (err, user, info) => {
        console.log(err)
        if (err || !user) {
            return res.status(400).json({
                message: info,
                user   : user
            });
        }
        var token = user['token'];
        return res.json({ user, token })
    })(req, res, next);
};

exports.verifySignature = function(req, res, next) {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info,
                user   : user
            });
        }
        return res.json(user)
    })(req, res, next);
};


