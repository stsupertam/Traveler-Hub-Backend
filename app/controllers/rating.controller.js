const User = require('mongoose').model('User')
const Rating = require('mongoose').model('Rating')
const Package = require('mongoose').model('Package')


exports.ratePackage = function(req, res, next) {
    Rating.findOne({ email: req.user.email, packageId: req.packageId})
        //.then((rating) => {
        //    if(!rating) {
        //        var rating = new Rating(
        //            { 
        //                email: req.user.email, 
        //                packageId: req.packageId, 
        //                rating: req.rating 
        //            })
        //        return rating.save()
        //    } else {
        //        return rating.update({ rating: req.rating })
        //    }
        //})
        //.then(() => {
        //    //Package.find({ _id: packageId }).populate('ratings', 'rating')
        //    Package.aggregate([
        //        { _id: packageId },
        //        {
        //            $lookup: {
        //                from: 
        //                localField:
        //                foriegnField:
        //            }
        //        }                
        //    ])
        //})
    return res.json()
}