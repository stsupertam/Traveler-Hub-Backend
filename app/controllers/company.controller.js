var Company = require('mongoose').model('Company');
var Counter = require('mongoose').model('Counter');

exports.create = function(req, res, next) {
    Counter.findOneAndUpdate(
        { active: 1 }, 
        { $inc: { company_id: 1 }}, 
        true
    ).then((counter) => {
        req.body['company_id'] = counter['company_id'];
        var company = new Company(req.body);
        return company.save()
    }).then((company) => {
        return res.json(company);
    }).catch((err) => {
        return next(err);
    });
};

exports.list = function(req, res, next) {
    Company.find({})
    .then((company) => {
        console.log(company)
        return res.json(company);
    }).catch((err) => {
        return next(err);
    });
};

exports.delete = function(req, res, next) {
    req.company.remove()
    .then(() => {
        return next();
    }).catch((err) => {
        return next(err);
    });
};

exports.update = function(req, res, next) {
    Company.findOneAndUpdate({ name: req.company.name }, req.body)
    .then((company) => {
        return res.json(company);
    })
    .catch((err) => {
        return next(err);
    })
};

exports.read = function(req, res) {
    res.json(req.company);
};

exports.companyByName = function(req, res, next, name) {
    Company.findOne({ company_name: name })
    .then((company) => {
        req.company = company;
        next();
    }).catch((err) => {
        return next(err);
    });
};
