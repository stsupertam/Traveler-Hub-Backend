var Package = require('mongoose').model('Package');
var Counter = require('mongoose').model('Counter');

exports.create = function(req, res, next) {
    Counter.findOneAndUpdate(
        { active: 1 }, 
        { $inc: { package_id: 1 }}, 
        true
    ).then((counter) => {
        req.body['package_id'] = counter['package_id'];
        var package = new Package(req.body);
        return package.save()
    }).then((package) => {
        return res.json(package);
    }).catch((err) => {
        return next(err);
    });
};

exports.list = function(req, res, next) {
    Package.find({})
    .then((package) => {
        return res.json(package);
    }).catch((err) => {
        return next(err);
    });
};

exports.delete = function(req, res, next) {
    req.package.remove()
    .then(() => {
        return next();
    }).catch((err) => {
        return next(err);
    });
};

exports.update = function(req, res, next) {
    Package.findOneAndUpdate({ id: req.package.id }, req.body)
    .then((package) => {
        return res.json(package);
    })
    .catch((err) => {
        return next(err);
    })
};

exports.read = function(req, res) {
    res.json(req.package);
};

exports.packageById = function(req, res, next, id) {
    Package.findOne({ package_id: id })
    .then((package) => {
        req.package = package;
        next();
    }).catch((err) => {
        return next(err);
    });
};
