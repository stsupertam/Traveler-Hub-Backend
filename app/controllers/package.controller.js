const moment = require('moment');
const numeral = require('numeral');
const Package = require('mongoose').model('Package');

var th_month = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 
    'เม.ย.', 'พ.ค.', 'มิ.ย.', 
    'ก.ค.', 'ส.ค.', 'ก.ย.', 
    'ต.ค.', 'พ.ย.', 'ธ.ค.'
]

var th_date_format = function(start_travel_date, travel_duration) {
    date = moment(start_travel_date)
        .add(travel_duration - 1, 'days')
        .format('MM/DD/YYYY').split('/');

    start_date = moment(start_travel_date).format('DD');
    end_date = date[1];
    month = date[0];
    year = date[2];
    travel_date = start_date + ' - ' + end_date + ' ' + th_month[month - 1] + ' ' + (parseInt(year) + 543);

    return travel_date;
};

exports.create = function(req, res, next) {
    var errors = {};
    var package = new Package(req.body);
    package['travel_date'] = th_date_format(req.body['start_travel_date'], req.body['travel_duration']);
    package['human_price'] = numeral(package['price']).format('0,0') + ' บาท';
    package['timeline'] = req.body['timeline'];
    package.validate()
        .then(() => {
            package.save();
            return res.json({ message: 'Create Package Successfully' });
        }).catch((err) => {
            return res.status(422).json(err['errors']);
        });
};

exports.list = function(req, res, next) {
    var pageOptions = {
        page: (((Number(req.query.page) - 1) < 0) ? 0 : req.query.page - 1) || 0,
        limit: Number(req.query.limit) || 1000
    };

    var total = ''
    Package.count({})
        .then((count) => {
            total = count;
            return Package.find({})
                .select('-_id -__v -created')
                .skip(pageOptions.page * pageOptions.limit)
                .limit(pageOptions.limit)
        })
        .then((packages) => {
            var response = {
                'total': total,
                'packages': packages
            }
            return res.json(response);
        })
        .catch((err) => {
            return next(err);
        });
};

exports.delete = function(req, res, next) {
    req.package.remove()
        .then(() => {
            return next();
        })
        .catch((err) => {
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
        });
};

exports.read = function(req, res) {
    return res.json(req.package);
};

exports.packageById = function(req, res, next, id) {
    Package.findOne({ package_id: id }).select('-_id -__v -created')
        .then((package) => {
            return res.json(package)
        })
        .catch((err) => {
            return next(err);
        });
};

exports.latest = function(req, res, next) {
    Package.find({}).sort('-created').limit(5).select('-_id -__v -created')
        .then((package) => {
            return res.json(package)
        })
        .catch((err) => {
            return next(err);
        });
};

exports.popular = function(req, res, next) {
    Package.find({}).sort('-number_of_views').limit(5).select('-_id -__v -created')
        .then((package) => {
            return res.json(package)
        })
        .catch((err) => {
            return next(err);
        });
};

exports.search = function(req, res, next) {
    var pageOptions = {
        page: (((Number(req.query.page) - 1) < 0) ? 0 : req.query.page - 1) || 0,
        limit: Number(req.query.limit) || 1000
    };
    var query = req.query;
    var raw_query = {
        from: pageOptions.page * pageOptions.limit,
        size: pageOptions.limit,
        _source: ['package_name', 'start_travel_date', 'end_travel_date']
    }
    var elastic_query = { 
        bool : {
            must : {},
            filter : {}
        },
    };

    if (query.name) { 
        //package.find({ $text: { $search: query.name }})
        console.log(elastic_query)
        if(!elastic_query['bool']['must']['match']) elastic_query['bool']['must']['match'] = {};
        elastic_query['bool']['must']['match']['text'] = {
            query: query.name,
            fuzziness: 1
        } 
    }
    if (query.minPrice || query.maxPrice) {
        if(!elastic_query['bool']['filter']['range']) elastic_query['bool']['filter']['range'] = {};
        if (query.minPrice && query.maxPrice) {
            elastic_query['bool']['filter']['range']['price'] = {}; 
            elastic_query['bool']['filter']['range']['price']['gte'] = query.minPrice; 
            elastic_query['bool']['filter']['range']['price']['lte'] = query.maxPrice; 
        } else if (query.minPrice) { 
            elastic_query['bool']['filter']['range']['price'] = {}; 
            elastic_query['bool']['filter']['range']['price']['gte'] = query.minPrice; 
        } else if (query.maxPrice) { 
            elastic_query['bool']['filter']['range']['price'] = {}; 
            elastic_query['bool']['filter']['range']['price']['lte'] = query.maxPrice; 
        }
    }
    if (query.Arrival || query.Departure) {
        if(!elastic_query['bool']['filter']['range']) elastic_query['bool']['filter']['range'] = {};
        start = new Date(query.Arrival + 'T00:00:00'.replace(/-/g, '\/').replace(/T.+/, ''));
        end = new Date(query.Departure + 'T00:00:00'.replace(/-/g, '\/').replace(/T.+/, ''));
        if (query.Arrival && query.Departure) {
            elastic_query['bool']['filter']['range']['start_travel_date'] = {}; 
            elastic_query['bool']['filter']['range']['end_travel_date'] = {}; 
            elastic_query['bool']['filter']['range']['start_travel_date']['gte'] = start; 
            elastic_query['bool']['filter']['range']['end_travel_date']['lte'] = end; 
        }
        else if (query.Arrival) {
            elastic_query['bool']['filter']['range']['start_travel_date'] = {}; 
            elastic_query['bool']['filter']['range']['start_travel_date']['gte'] = start; 
        }
        else if (query.Departure) {
            elastic_query['bool']['filter']['range']['end_travel_date'] = {}; 
            elastic_query['bool']['filter']['range']['end_travel_date']['lte'] = end; 
        }
    }
    if (query.company) {
        if(!elastic_query['bool']['must']['match']) elastic_query['bool']['must']['match'] = {};
        elastic_query['bool']['must']['match']['company'] = {
            query: query.company,
            fuzziness: 1
        } 
    }
    if (query.region) {
        if(!elastic_query['bool']['must']['match']) elastic_query['bool']['must']['match'] = {};
        elastic_query['bool']['must']['match']['region'] = {
            query: query.region,
            fuzziness: 1
        } 
    }
    if (query.province) {
        if(!elastic_query['bool']['must']['match']) elastic_query['bool']['must']['match'] = {};
        elastic_query['bool']['must']['match']['province'] = {
            query: query.province,
            fuzziness: 1
        } 
    }

    raw_query['query'] = elastic_query;
    Package.esSearch(raw_query, function (err, packages) {
        if (err) return next(err)
        var results = packages.hits.hits;
        var total = results.length;
        var response = {
            'total': total,
            'packages': results
        };
        return res.json(response)
    });
};

