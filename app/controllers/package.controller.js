var Package = require('mongoose').model('Package');

exports.create = function(req, res, next) {
    var package = new Package(req.body);

    package.save(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(package);
        }

    });
};

exports.list = function(req, res, next) {
    Package.find({}, function(err, package) {
        if (err) {
            return next(err);
        } else {
            res.json(package);
        }

    });
};

exports.delete = function(req, res, next) {
    req.package.remove(function(err) {
        if (err) {
            return next()
        } else {
            res.json(req.package);
        }
    });
};
exports.update = function(req, res, next) {
    Package.findOneAndUpdate({name: req.package.name}, req.body,
        function(err, package) {
            if (err) {
                return next(err);
            } else {
                res.json(package);
            }
    });
};

exports.read = function(req, res) {
    res.json(req.package);
};

exports.packageById = function(req, res, next, id) {
    Package.findOne({
        id: id
    }, function(err, package) {
        if (err) {
            return next(err);
        } else {
            req.package = package;
            next();
        }
    });
};
