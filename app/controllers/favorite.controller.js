const mongoose = require('mongoose')
const User = require('mongoose').model('User')
const Favorite = require('mongoose').model('Favorite')
const Package = require('mongoose').model('Package')
const _ = require('lodash')

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
