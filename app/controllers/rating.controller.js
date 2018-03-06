const mongoose = require('mongoose')
const User = require('mongoose').model('User')
const Rating = require('mongoose').model('Rating')
const Package = require('mongoose').model('Package')


exports.ratePackage = function(req, res, next) {
    Rating.findOne({ email: req.user.email, packageId: req.body.packageId})
        .then((rating) => {
            if(!rating) {
                var rating = new Rating(
                    { 
                        email: req.user.email, 
                        packageId: req.body.packageId, 
                        rating: req.body.rating 
                    })
                return rating.save()
            } else {
                return rating.update({ rating: req.body.rating })
            }
        })
        .then(() => {
            //Package.find({ _id: packageId }).populate('ratings', 'rating')
            console.log(req.body.packageId)
            return Rating.aggregate([
                { $match: { packageId: mongoose.Types.ObjectId(req.body.packageId) }},
                { 
                    $group: {
                        _id: '$packageId',
                        avgRating: { $avg: '$rating' }
                    }
                }
            ])
        })
        .then((rating) => {
            console.log(rating[0])
            return Package.findOneAndUpdate({ _id: req.body.packageId }
                , { $set: { rating: rating[0].avgRating }}, { new: true })
        })
        .then((package) => {
            return res.json({ rating: package.rating, message: 'update rating successfully'})
        })
        .catch((err) => {
            return next(err)
        })

}