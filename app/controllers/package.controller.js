const moment = require('moment');
const numeral = require('numeral');
const Package = require('mongoose').model('Package');
const Counter = require('mongoose').model('Counter');

var th_month = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 
    'เม.ย', 'พ.ค.', 'มิ.ย.', 
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
    Counter.findOneAndUpdate({ active: 1 }, { $inc: { package_id: 1 }}, true)
        .then((counter) => {
            req.body['package_id'] = counter['package_id'];
            package['travel_date'] = th_date_format(req.body['start_travel_date'], req.body['travel_duration']);
            package['human_price'] = numeral(package['price']).format('0,0') + ' บาท';
            package['timeline'] = req.body['timeline'];
            return package.validate();
        })
        .catch((err) => {
            console.log('package fail validate');
            Object.assign(errors, err['errors']);
        })
        .then(() => {
            if(Object.keys(errors).length === 0) {
                package.save();
                return res.json(package);
            } else {
                return res.status(422).json(errors);
            }
        })
        .catch((err) => {
            return next(err);
        });
};

exports.list = function(req, res, next) {
    Package.find({}).select('-_id -__v -created')
        .then((packages) => {
            return res.json(packages);
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
    Package.find({}).sort('-created').limit(5).select('_id -__v -created')
        .then((package) => {
            return res.json(package)
        })
        .catch((err) => {
            return next(err);
        });
};

exports.popular = function(req, res, next) {
    Package.find({}).sort('-number_of_views').limit(5).select('_id -__v -created')
        .then((package) => {
            return res.json(package)
        })
        .catch((err) => {
            return next(err);
        });
};

exports.search = function(req, res, next) {
    console.log(req.query['name'])
    Package.find({ $text: { $search: req.query['name'] }})
        .then((package) => {
            return res.json(package)
        })
        .catch((err) => {
            return next(err);
        });
}
