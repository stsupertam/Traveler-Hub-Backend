const mongoose = require('mongoose')
const User = require('mongoose').model('User')
const Favorite = require('mongoose').model('Favorite')
const Package = require('mongoose').model('Package')
const _ = require('lodash')

const regions = ['เหนือ', 'ใต้', 'ตะวันออกเฉียงเหนือ', 'ตะวันตก', 'กลาง', 'ตะวันออก']
const travel_types = ['ธรรมะ', 'ผจญภัย', 'ธรรมชาติ', 'สถานที่น่าสนใจ']

async function aggregate(company, date, type) {
    let items = []
    if(type === 'region') {
        items = regions    
    } else {
        items = travel_types
    }
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

    match['$match']['updated'] = {
        '$gte': date.startDate,
        '$lte': date.endDate
    }

    let matchKey = 'package.' + type
    for (let item of items) {
        match['$match'][matchKey] = item
        let favorite = await Favorite.aggregate([
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
                    'like': 1,
                    'updated': 1,
                }
            },
            {
               '$group': {
                    '_id': '$package.region',
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
                'name': favorite[0]._id[0],
                'like': favorite[0].like,
                'dislike': favorite[0].dislike
            }
        }
        favorite = temp
        result.push(favorite)
    }
    return result
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

exports.likeDislike = function(req, res, next) {
    let packageId = mongoose.Types.ObjectId(req.body.packageId)
    Favorite.findOne({ email: req.user.email, packageId: packageId })
        .then((favorite) => {
            if(!favorite) {
                let favorite = new Favorite(
                    { 
                        email: req.user.email, 
                        packageId: mongoose.Types.ObjectId(req.body.packageId), 
                        like: req.body.like 
                    })
                return favorite.save()
            } else {
                return favorite.update({ like: req.body.like, updated: Date.now() })
            }
        })
        .then((favorite) => {
            Package.findById(packageId)
                .then((package) => {
                    if(req.body.like) {
                        package.like += 1
                    } else {
                        package.dislike += 1
                    }
                    package.save()
                    return res.json({ 'message': 'Update Successfully'})
                })
                .catch((err) => {
                    return next(err)
                })
        })
        .catch((err) => {
            return next(err)
        })
}

exports.display = function(req, res, next) {
    Favorite.find({ email: req.user.email })
        .limit(10)
        .sort('-updated')
        .populate('packageId', 'package_name travel_date human_price image detail')
        .then((favorite) => {
            return res.json(favorite)
        })
        .catch((err) => {
            return next(err)
        })
}

exports.report = async function(req, res, next) {
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

    if(req.query.region) {
        aggResult = await aggregate(req.user.company, date, 'region')
    } else if(req.query.travel_types) {
        aggResult = await aggregate(req.user.company, date, 'travel_types')
    }
    return res.json(aggResult)
}
