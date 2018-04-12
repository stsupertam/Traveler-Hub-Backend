const mongoose = require('mongoose')
const History = mongoose.model('History')

async function aggregate(company, items, date, type) {
    items = items.split(' ')
    let result = []
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
            'package.company': company,
        } 
    }

    let startDateP = new Date(date.startDate.setDate(date.startDate.getDate() + 1))
    let endDateP = new Date(date.endDate.setDate(date.endDate.getDate() + 1))
    match['$match']['updated'] = {
        '$gte': startDateP,
        '$lte': endDateP
    }

    let matchKey = 'package.' + type
    for (let item of items) {
        match['$match'][matchKey] = item
        let history = await History.aggregate([
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
                    'updated': 1,
                    'y': {
                        '$year': '$updated'
                    },
                    'm': {
                        '$month': '$updated'
                    },
                    'd': {
                        '$dayOfMonth': '$updated'
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
                }
            },
            {
                '$project': {
                    '_id': 1, 
                    'count': 1,
                    'key': item
                }
            }
        ])
        .allowDiskUse(true)
        result.push(history)
    }
    return result
}

function mapDate(items, date) {
    data = []
    for (let d = date.startDate; d <= date.endDate; d.setDate(d.getDate() + 1)) {
        let temp = new Date(d)
        temp = new Date(temp.setDate((temp.getDate() - 1)))
        let result = {}
        let year = temp.getFullYear()
        let month = temp.getMonth() + 1
        let day = temp.getDate()
        let date = `${year}-${month}-${day}`
        result['date'] = date

        for (let item of items) {
            let count = 0
            for (let data of item) {
                let dataYear = data['_id']['year']
                let dataMonth = data['_id']['month']
                let dataDay = data['_id']['day']
                if(year === dataYear && month === dataMonth && day === dataDay) {
                    count = data['count']
                    break
                }
            }
            result[item[0].key] = count
        }
        data.push(result);
    }
    return data
}

exports.read = function(req, res) {
    return res.json(req.history)
}

exports.historyByEmail = function(req, res, next, email) {
    History.findOne({ email: email }).select('-_id -__v -updated')
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

exports.report = async function(req, res, next) {
    let aggResult = []
    let result = []
    let regions = []
    let travel_types = []
    let date = {}
    date.startDate = new Date(req.query.startDate)
    date.endDate = new Date(req.query.endDate)

    if(req.query.regions) {
        aggResult = await aggregate(req.user.company, req.query.region, date, 'region')
    } else if(req.query.travel_types) {
        aggResult = await aggregate(req.user.company, req.query.travel_type, date, 'travel_types')
    } else if(req.query.provinces) {
        aggResult = await aggregate(req.user.company, req.query.provinces, date, 'provinces')
    }

    result = mapDate(aggResult, date)
    return res.json(await result)
}

