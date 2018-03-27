const mongoose = require('mongoose')
const History = mongoose.model('History')

//exports.updateHistory = function(req, res, next) {
//    History.findOne({ email: req.body.email })
//        .then((history) => {
//            if(!history) {
//                history = new History({ email: req.body.email, packageId: req.body.packageId })
//                history.save()
//                    .then(() => {
//                        return res.json({ message: 'History successfully updated' })
//                    })
//                    .catch((err) => {
//                        return next(err)
//                    })
//            } else {
//                history.packageId.addToSet(req.body._id)
//                history.save()
//                    .then(() => {
//                        return res.json({ message: 'History successfully updated' })
//                    })
//                    .catch((err) => {
//                        return next(err)
//                    })
//            }
//        })
//        .catch((err) => {
//            return next(err)
//        })
//}

exports.read = function(req, res) {
    return res.json(req.history)
}

exports.historyByEmail = function(req, res, next, email) {
    History.findOne({ email: email }).select('-_id -__v -created')
        .populate('packageId', 'province travel_types region tags')
        .populate('user', 'gender age')
        .then((history) => {
            req.history = history
            return next()
        })
        .catch((err) => {
            return next(err)
        })
}

exports.report = function(req, res, next) {
    let lookup = {
        '$lookup': {
            'from': 'packages',
            'localField': 'packageId',
            'foreignField': '_id',
            'as': 'package'
        },
    }

    let match = {
        '$match': { 
            'package.company': req.params.company,
            //'packageId':  
        } 
    }
    if(req.query.packageId) {
        match['$match']['packageId'] = mongoose.Types.ObjectId(req.query.packageId)
    } else if(req.query.region) {
        match['$match']['package.region'] = req.query.region
    } else if(req.query.travel_type) {
        match['$match']['package.travel_types'] = req.query.travel_type
    } else if(req.query.province) {
        match['$match']['package.provinces'] = req.query.province
    }

    if(req.query.startDate && req.query.endDate) {
        match['$match']['created'] = {
            '$gte': new Date(req.query.startDate),
            '$lte': new Date(req.query.endDate)
        }
    } 

    History.aggregate([
        lookup,
        match,
        { '$sort': { 'created': -1 } },
        {
            '$project': {
                'email': 1,
                'packageId': 1,
                'package.package_name': 1,
                'package.provinces': 1,
                'package.region': 1,
                'package.travel_types': 1,
                'y': {
                    '$year': '$created'
                },
                'm': {
                    '$month': '$created'
                },
                'd': {
                    '$dayOfMonth': '$created'
                }
            }
        },
        {
           '$group': {
                '_id': {
                    'year': '$y',
                    'month': '$m',
                    'day': '$d'
                },
                'count': { 
                    '$sum': 1 
                },
                //'region': { '$push': '$package.region'},
            }
        },
    ])
    .then((history) => {
        return res.json(history)
    })
    .catch((err) => {
        return next(err)
    })
}

