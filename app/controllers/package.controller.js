var moment = require('moment');
var numeral = require('numeral');
var Package = require('mongoose').model('Package');
var Counter = require('mongoose').model('Counter');


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
    var package = req.package.toObject();
    package['travel_date'] = th_date_format(package['start_travel_date'], package['travel_duration']);
    package['price'] = numeral(package['price']).format('0,0') + ' บาท'

    delete package.start_travel_date;
    delete package.travel_duration;
    delete package.__v;
    delete package._id;
    delete package.created;
    delete package.number_of_views;

    res.json(package);
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
