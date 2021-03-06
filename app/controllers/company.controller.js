const Company = require('mongoose').model('Company')

exports.create = function(req, res, next) {
    let errors = {}
    let company = new Company(req.body)
    company.validate()
        .catch((err) => {
            Object.assign(errors, err['errors'])
        })
        .then(() => {
            if(Object.keys(errors).length === 0) {
                company.save()
                return res.json(company)
            } else {
                return res.status(422).json(errors)
            }
        })
        .catch((err) => {
            return next(err)
        })
}

exports.list = function(req, res, next) {
    Company.find({})
        .then((company) => {
            return res.json(company)
        })
        .catch((err) => {
            return next(err)
        })
}

exports.delete = function(req, res, next) {
    req.company.remove()
        .then(() => {
            return next()
        })
        .catch((err) => {
            return res.status(404).json('Company doesn\'t exist')
        })
}

exports.update = function(req, res, next) {
    Company.findOneAndUpdate({ name: req.company.name }, req.body)
        .then((company) => {
            return res.json(company)
        })
        .catch((err) => {
            return next(err)
        })
}

exports.read = function(req, res) {
    res.json(req.company)
}

exports.companyByName = function(req, res, next, name) {
    Company.findOne({ company_name: name })
        .populate('packages', 'package_name')
        .then((company) => {
            req.company = company
            next()
        })
        .catch((err) => {
            return res.status(404).json('Company doesn\'t exist')
        })
}
