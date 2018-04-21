const mongoose = require('mongoose')
const User = require('mongoose').model('User')
const Favorite = require('mongoose').model('Favorite')
const Recommend = require('mongoose').model('Recommend')
const Package = require('mongoose').model('Package')
const _ = require('lodash')

function synchronize() {
    let stream = Recommend.synchronize()
    let count = 0
    stream.on('data', function(err, doc){
        count++
    })
    stream.on('close', function(){
        console.log('Recommend: indexed ' + count + ' documents!')
    })
    stream.on('error', function(err){
        console.log(err)
    })
}

async function add_like_to_recommend(email, packageId) {
    let recommend = await Recommend.findOne({ email: email })
    if(recommend) {
        let index = recommend.package_likes.indexOf(packageId)
        if(index > -1) {
            recommend.package_likes.splice(index, 1);
        } else {
            if(recommend.package_likes.length === 0) {
                recommend.package_likes = []
            }
            recommend.package_likes.push(packageId)
        }
        recommend.save()
    } else {
        recommend = {
            email: email,
            package_likes: []
        }
        recommend.package_likes.push(packageId)
        Recommend.create(recommend)
    }
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
                favorite.save()
                    .then(() => {
                        Package.findById(packageId)
                            .then((package) => {
                                if(req.body.like) {
                                    add_like_to_recommend(req.user.email, packageId)
                                    synchronize()
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
            } else {
                if(req.body.like === favorite.like) {
                    favorite.remove()
                        .then(() => {
                            return Package.findById(packageId)
                        })
                        .then((package) => {
                            if(req.body.like === true) {
                                add_like_to_recommend(req.user.email, packageId)
                                synchronize()
                                package.like -= 1
                            } else {
                                package.dislike -= 1
                            }
                            package.save()
                            return res.json({ 'message': 'Update Successfully'})
                        })
                        .catch((err) => {
                            return next(err)
                        })
                } else {
                    favorite.update({ like: req.body.like, updated: Date.now() })
                        .then(() => {
                            Package.findById(packageId)
                                .then((package) => {
                                    if(req.body.like) {
                                        add_like_to_recommend(req.user.email, packageId)
                                        synchronize()
                                        package.like += 1
                                        package.dislike -= 1
                                    } else {
                                        package.like -= 1
                                        package.dislike += 1
                                    }
                                    package.save()
                                    return res.json({ 'message': 'Update Successfully'})
                                })
                                .catch((err) => {
                                    return next(err)
                                })
                        })
                }
            }
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


