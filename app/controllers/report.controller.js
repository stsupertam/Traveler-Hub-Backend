const mongoose = require('mongoose')
const History = mongoose.model('History')
const Favorite = mongoose.model('Favorite')
const Package = mongoose.model('Package')

const regions = ['เหนือ', 'ใต้', 'ตะวันออกเฉียงเหนือ', 'ตะวันตก', 'กลาง', 'ตะวันออก']
const travel_types = ['ผจญภัย', 'ธรรมชาติ', 'สถานที่น่าสนใจ', 'ศาสนา', 'ขึ้นดอย', 'อุทยาน', 'ทะเลและหมู่เกาะ', 'ย้อนรอยอดีต', 'เทศกาล']
const lookupPackage = {
    '$lookup': {
        'from': 'packages',
        'localField': 'packageId',
        'foreignField': '_id',
        'as': 'package'
    },
}
const lookupUser = {
    '$lookup': {
        'from': 'users',
        'localField': 'email',
        'foreignField': 'email',
        'as': 'user'
    },
}

async function findTheGreatest(mostType, company) {
    return Package.findOne({ company: company })
        .sort(mostType)
        .select('_id package_name company like dislike number_of_views')

}

async function aggregateFavorite(company, date, type) {
    let items = []
    if(type === 'region') {
        items = regions    
    } else {
        items = travel_types
    }
    let result = []
    let match = {
        '$match': { 
            'package.company': company,
        } 
    }

    match['$match']['updated'] = {
        '$gte': date.startDate,
        '$lte': date.endDate
    }

    let matchKey = 'package.' + type
    for (let item of items) {
        match['$match'][matchKey] = item
        console.log(item)
        let favorite = await Favorite.aggregate([
            lookupPackage,
            match,
            {
                '$project': {
                    'email': 1,
                    'packageId': 1,
                    'package.package_name': 1,
                    'package.provinces': 1,
                    'package.region': 1,
                    'package.travel_types': 1,
                    'like': 1,
                    'updated': 1,
                }
            },
            {
               '$group': {
                    '_id': '$package.' + type,
                    'like': {
                        '$sum': { '$cond': ['$like', 1, 0] }
                    },
                    'dislike': {
                        '$sum': { '$cond': ['$like', 0, 1] }
                    },
                }
            },
        ])
        .allowDiskUse(true)
        let temp = {}
        if(favorite.length === 0) {
            temp = {
                'name': item,
                'like': 0,
                'dislike': 0
            }
        } else {
            temp = {
                'name': item,
                'like': favorite[0].like,
                'dislike': favorite[0].dislike
            }
        }
        favorite = temp
        result.push(favorite)
    }
    return result
}

async function aggregateHistory(company, items, date, type) {
    items = items.split(' ')
    let result = []
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
            lookupPackage,
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

async function aggregateTotal(company, date) {
    let result = []
    let match = {
        '$match': { 
            'package.company': company,
        } 
    }
    match['$match']['updated'] = {
        '$gte': date.startDate,
        '$lte': date.endDate
    }
    let history = await History.aggregate([
        lookupPackage,
        lookupUser,
        match,
        {
            '$project': {
                'email': 1,
                'gender': '$user.gender',
                'updated': 1,
            }
        },
        {
           '$group': {
                '_id': '$gender',
                'count': { 
                    '$sum': 1 
                },
            }
        },
    ])
    .allowDiskUse(true)
    for(item of history) {
        let temp = {}
        temp.name = item._id[0]
        temp.value = item.count
        result.push(temp)
    }
    console.log(history)
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

function getDate(dateRange) {
    let result = {}
    let date = new Date(Date.now())
    let startDate = ''
    let endDate = ''
    let genDate = function(year, month, date) {
        let tempDate = new Date(year, month, date)
        let tempDateP = new Date(tempDate.setDate(tempDate.getDate() + 1))
        return tempDateP
    }
    if(dateRange === 'day') {
        result.startDate = genDate(date.getFullYear(), date.getMonth(), date.getDate())
        result.endDate = genDate(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    } else if(dateRange === 'week') {
        let startDate = new Date(date.setDate(date.getDate() - date.getDay()));
        let endDate = new Date(date.setDate(date.getDate() - date.getDay() + 6));
        let startDateP = new Date(startDate.setDate(startDate.getDate() + 1))
        let endDateP = new Date(endDate.setDate(endDate.getDate() + 1))
        result.startDate = new Date(startDateP.setHours(0, 0, 0, 0))
        result.endDate = new Date(endDateP.setHours(0, 0, 0, 0))
    } else if(dateRange === 'month') {
        result.startDate = genDate(date.getFullYear(), date.getMonth(), 1)
        result.endDate = genDate(date.getFullYear(), date.getMonth() + 1, 0)
    } else if(dateRange === 'year') {
        result.startDate = genDate(date.getFullYear(), 0, 1)
        result.endDate = genDate(date.getFullYear(), 11, 31)
    }
    return result
}

exports.reportViewTotal = async function(req, res, next) {
    let aggResult = []
    let result = []
    let date = ''

    if(req.query.latestDate) {
        date = getDate('day')
    } else if(req.query.latestWeek) {
        date = getDate('week')
    } else if(req.query.latestMonth) {
        date = getDate('month')
    } else if(req.query.latestYear) {
        date = getDate('year')
    }

    aggResult = await aggregateTotal(req.user.company, date)

    return res.json(aggResult)
}

exports.reportHistory = async function(req, res, next) {
    let aggResult = []
    let result = []
    let regions = []
    let travel_types = []
    let date = {}
    date.startDate = new Date(req.query.startDate)
    date.endDate = new Date(req.query.endDate)

    if(req.query.regions) {
        aggResult = await aggregateHistory(req.user.company, req.query.regions, date, 'region')
    } else if(req.query.travel_types) {
        aggResult = await aggregateHistory(req.user.company, req.query.travel_types, date, 'travel_types')
    } else if(req.query.provinces) {
        aggResult = await aggregateHistory(req.user.company, req.query.provinces, date, 'provinces')
    }

    result = mapDate(aggResult, date)
    return res.json(await result)
}

exports.reportFavorite = async function(req, res, next) {
    let aggResult = []
    let result = []
    let date = ''

    if(req.query.latestDay) {
        date = getDate('day')
    } else if(req.query.latestWeek) {
        date = getDate('week')
    } else if(req.query.latestMonth) {
        date = getDate('month')
    } else if(req.query.latestYear) {
        date = getDate('year')
    }

    if(req.query.region) {
        aggResult = await aggregateFavorite(req.user.company, date, 'region')
    } else if(req.query.travel_types) {
        aggResult = await aggregateFavorite(req.user.company, date, 'travel_types')
    }
    return res.json(aggResult)
}

exports.most = async function(req, res, next) {
    let mostLike = await findTheGreatest('-like', req.user.company)
    let mostDisLike = await findTheGreatest('-dislike', req.user.company)
    let mostView = await findTheGreatest('-number_of_views', req.user.company)

    let result = {
        like: mostLike,
        dislike: mostDisLike,
        view: mostView
    }
    return res.json(result)
}

exports.package = function(req, res, next) {
    Package.find({ company: req.user.company })
        .select('_id package_name like dislike number_of_views region province ')
        .then((packages) => {
            return res.json(packages)
        })
        .catch((err) => {
            return next(err)
        })
}
