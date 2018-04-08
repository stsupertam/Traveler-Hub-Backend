const mongoose = require('mongoose')
const History = mongoose.model('History')

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
            'package.company': req.user.company,
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

    let startDate = new Date(req.query.startDate)
    let endDate = new Date(req.query.endDate)
    if(req.query.startDate && req.query.endDate) {
        startDateP = new Date(startDate.setDate(startDate.getDate() + 1))
        endDateP = new Date(endDate.setDate(endDate.getDate() + 1))
        match['$match']['created'] = {
            '$gte': startDateP,
            '$lte': endDateP
        }
    } 

    History.aggregate([
        lookup,
        match,
        {
            '$project': {
                'email': 1,
                'packageId': 1,
                'package.package_name': 1,
                'package.provinces': 1,
                'package.region': 1,
                'package.travel_types': 1,
                'created': 1,
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
                //'province': { '$push': '$package.provinces'},
            }
        },
    ])
    .allowDiskUse(true)
    .then((history) => {
        let data = []
        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            let temp = new Date(d)
            let item = {}
            temp = new Date(temp.setDate((temp.getDate() - 1)))
            let year = temp.getFullYear()
            let month = temp.getMonth() + 1
            let day = temp.getDate()
            let count = 0
            for (let i = 0; i < history.length; i++) {
                historyYear = history[i]['_id']['year']
                historyMonth = history[i]['_id']['month']
                historyday = history[i]['_id']['day']
                if(year === historyYear && month === historyMonth && day === historyday) {
                    count = history[i]['count']
                    break
                }
            }
            let date = `${year}-${month}-${day}`
            item['x'] = date
            item['y'] = count
            data.push(item);
        }
        return res.json(data)
        //return res.json(history)
    })
    .catch((err) => {
        return next(err)
    })
}

