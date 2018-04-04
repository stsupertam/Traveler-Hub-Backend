const mongoose = require('mongoose')
const User = require('mongoose').model('User')
const Bookmark = require('mongoose').model('Bookmark')
const Package = require('mongoose').model('Package')
const _ = require('lodash')

exports.update = function(req, res, next) {
    let packageId = mongoose.Types.ObjectId(req.body.packageId)
    Bookmark.findOne({ email: req.user.email, packageId: packageId })
        .then((bookmark) => {
            if(!bookmark) {
                let bookmark = new Bookmark(
                    { 
                        email: req.user.email, 
                        packageId: mongoose.Types.ObjectId(req.body.packageId), 
                        bookmark: req.body.bookmark 
                    })
                return bookmark.save()
            } else {
                return bookmark.update({ bookmark: req.body.bookmark, updated: Date.now() })
            }
        })
        .then((bookmark) => {
            return res.json({ 'message': 'Update Successfully'})
        })
        .catch((err) => {
            return next(err)
        })
}

exports.display = function(req, res, next) {
    Bookmark.find({ email: req.user.email, bookmark: true })
        .limit(10)
        .sort('-updated')
        .populate('packageId', 'package_name travel_date human_price image detail')
        .then((bookmark) => {
            return res.json(bookmark)
        })
        .catch((err) => {
            return next(err)
        })
}

