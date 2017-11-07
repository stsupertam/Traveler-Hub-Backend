var Company = require('mongoose').model('Company');

exports.create = function(req, res, next) {
    Company.count({})
    .then((count) => {
        req.body['id'] = count + 1;
        var company = new Company(req.body);
        company.save()
    }).catch((err) => {
        return next(err)
    });
};

exports.list = function(req, res, next) {
    Company.find({}, (err, company) => {
        if (err) {
            return next(err);
        } else {
            res.json(companys);
        }

    });
};

exports.delete = function(req, res, next) {
    req.company.remove((err) => {
        if (err) {
            return next()
        } else {
            res.json(req.company);
        }
    });
};
exports.update = function(req, res, next) {
    Company.findOneAndUpdate({name: req.company.name}, req.body,
        (err, company) => {
            if (err) {
                return next(err);
            } else {
                res.json(company);
            }
    });
};

exports.read = function(req, res) {
    res.json(req.company);
};

exports.companyById = function(req, res, next, id) {
    Company.findOne({
        name: name
    }, (err, company) => {
        if (err) {
            return next(err);
        } else {
            req.company = company;
            next();
        }
    });
};
