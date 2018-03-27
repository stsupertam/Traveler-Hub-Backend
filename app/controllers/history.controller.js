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

exports.companyStatistic = function(req, res, next) {
    History.aggregate([
        {
            '$lookup': {
                'from': 'packages',
                'localField': 'packageId',
                'foreignField': '_id',
                'as': 'package'
            },
        },
        { 
            '$match': { 
                'package.company': req.params.company,
                'packageId': mongoose.Types.ObjectId(req.query.packageId) 
            } 
        },
       // {
       //     '$group': {
       //         '_id': { 'email': '$email' }
       //     }
       // },
        {
            '$project': {
                'email': 1,
                'packageId': 1,
                'package.package_name': 1,
                'created': 1
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

