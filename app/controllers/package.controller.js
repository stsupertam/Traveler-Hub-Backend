const moment = require('moment')
const numeral = require('numeral')
const Package = require('mongoose').model('Package')

var th_month = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 
    'เม.ย.', 'พ.ค.', 'มิ.ย.', 
    'ก.ค.', 'ส.ค.', 'ก.ย.', 
    'ต.ค.', 'พ.ย.', 'ธ.ค.'
]

var th_date_format = function(start_travel_date, travel_duration) {
    date = moment(start_travel_date)
        .add(travel_duration - 1, 'days')
        .format('MM/DD/YYYY').split('/')

    start_date = moment(start_travel_date).format('DD')
    end_date = date[1]
    month = date[0]
    year = date[2]
    travel_date = start_date + ' - ' + end_date + ' ' + th_month[month - 1] + ' ' + (parseInt(year) + 543)

    return travel_date
}

exports.create = function(req, res, next) {
    var errors = {}
    var package = new Package(req.body)
    package['travel_date'] = th_date_format(req.body['start_travel_date'], req.body['travel_duration'])
    package['human_price'] = numeral(package['price']).format('0,0') + ' บาท'
    package['timeline'] = req.body['timeline']
    package.validate()
        .then(() => {
            package.save()
            return res.json({ message: 'Create Package Successfully' })
        }).catch((err) => {
            return res.status(422).json(err['errors'])
        })
}

exports.list = function(req, res, next) {
    var pageOptions = {
        page: (((Number(req.query.page) - 1) < 0) ? 0 : req.query.page - 1) || 0,
        limit: Number(req.query.limit) || 16
    }
    totalPage = 0
    Package.count({})
        .then((count) => {
            var total = count
            totalPage  = Math.ceil(total / pageOptions.limit)
            return Package.find({})
                .select('-__v -created')
                .skip(pageOptions.page * pageOptions.limit)
                .limit(pageOptions.limit)
        })
        .then((packages) => {
            var response = {
                'totalPage': totalPage,
                'currentPage': Number(req.query.page),
                'packages': packages
            }
            return res.json(response)
        })
        .catch((err) => {
            return next(err)
        })
}

exports.delete = function(req, res, next) {
    req.package.remove()
        .then(() => {
            return next()
        })
        .catch((err) => {
            return next(err)
        })
}

exports.update = function(req, res, next) {
    Package.findOneAndUpdate({ _id: req.package.id }, req.body)
        .then((package) => {
            return res.json(package)
        })
        .catch((err) => {
            return next(err)
        })
}

exports.read = function(req, res, next) {
    Package.findOneAndUpdate({ _id: req.package._id}, { $inc: { number_of_views: 1 }})
        .then((package) => {
            return res.json(req.package)
        })
        .catch((err) => {
            return next(err)
        })
}

exports.packageById = function(req, res, next, id) {
    Package.findOne({ _id: id }).select('-__v -created')
        .then((package) => {
            req.package = package
            next()
        })
        .catch((err) => {
            return next(err)
        })
}

exports.latest = function(req, res, next) {
    Package.find({}).sort('-created').limit(5).select('-__v -created')
        .then((package) => {
            return res.json(package)
        })
        .catch((err) => {
            return next(err)
        })
}

exports.popular = function(req, res, next) {
    Package.find({}).sort('-number_of_views').limit(5).select('-__v -created')
        .then((package) => {
            return res.json(package)
        })
        .catch((err) => {
            return next(err)
        })
}

exports.search = function(req, res, next) {
    var pageOptions = {
        page: (((Number(req.query.page) - 1) < 0) ? 0 : req.query.page - 1) || 0,
        limit: Number(req.query.limit) || 1000
    }
    var query = req.query
    var raw_query = {
        from: pageOptions.page * pageOptions.limit,
        size: pageOptions.limit,
    }
    var elastic_query = { 
        bool : {
            must : [],
            filter : []
        },
    }
    if (query.name) { 
        var text = {
            match: {
                text: {
                    query: query.name
                }
            }
        }
        elastic_query['bool']['must'].push(text)
    }
    if (query.minPrice || query.maxPrice) {
        if (query.minPrice && query.maxPrice) {
            var price = {
                range:{
                    price: {
                        gte: query.minPrice,
                        lte: query.maxPrice
                    }
                }
            }
            elastic_query['bool']['filter'].push(price) 
        } else if (query.minPrice) { 
            var price = {
                range: {
                    price: {
                        gte: query.minPrice
                    }
                }
            }
            elastic_query['bool']['filter'].push(price)
        } else if (query.maxPrice) { 
            var price = {
                range: {
                    price: {
                        lte: query.maxPrice
                    }
                }
            }
            elastic_query['bool']['filter'].push(price) 
        }
    }
    if (query.Arrival || query.Departure) {
        start = new Date(query.Arrival + 'T00:00:00'.replace(/-/g, '\/').replace(/T.+/, ''))
        end = new Date(query.Departure + 'T00:00:00'.replace(/-/g, '\/').replace(/T.+/, ''))
        if (query.Arrival && query.Departure) {
            var date = {
                range: {
                    start_travel_date: {
                        gte: start
                    }            
                },
                range: {
                    end_travel_date: {
                        lte: end
                    }            
                }
            }
            elastic_query['bool']['filter'].push(date)
        }
        else if (query.Arrival) {
            var date = {
                range: {
                    start_travel_date: {
                        gte: start
                    }
                }
            }
            elastic_query['bool']['filter'].push(date)
        }
        else if (query.Departure) {
            var date = {
                range: {
                    end_travel_date: {
                        lte: end
                    }
                }
            }
            elastic_query['bool']['filter'].push(date) 
        }
    }
    if (query.company) {
        var company = {
            match: {
                company: {
                    query: query.company
                }
            }
        }
        elastic_query['bool']['must'].push(company)
    }
    if (query.region) {
        var region = {
            match: {
                region: {
                    query: query.region
                }
            }
        }
        elastic_query['bool']['must'].push(region)
    }
    if (query.province) {
        var province = {
            match: {
                province: {
                    query: query.province
                }
            }
        }
        elastic_query['bool']['must'].push(province)
    }

    raw_query['query'] = elastic_query
    Package.esSearch(raw_query, function (err, packages) {
        if (err) return next(err)
        var results = packages.hits.hits
        var total = results.length
        var totalPage = Math.ceil(total / req.query.limit)
        var response = {
            'totalPage': total,
            'currentPage': Number(req.query.page),
            'packages': results
        }
        return res.json(response)
    })
}

