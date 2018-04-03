const mongoose = require('mongoose')
const User = require('mongoose').model('User')
const Favorite = require('mongoose').model('Favorite')
const Package = require('mongoose').model('Package')
const _ = require('lodash')

exports.likeDislike = function(req, res, next) {
    Favorite.findOne({ email: req.user.email, packageId: mongoose.Types.ObjectId(req.body.packageId) })
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
                return favorite.update({ favorite: req.body.like })
            }
        })
        .then((favorite) => {
            return res.json({ 'message': 'Update Successfully'})
        })
}

exports.display = function(req, res, next) {
    Favorite.find({ email: req.user.email })
        .then((favorite) => {
            return res.json(favorite)
        })
        .catch((err) => {
            return next(err)
        })
}