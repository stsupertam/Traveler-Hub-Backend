const mongoose = require('mongoose')
const History = mongoose.model('History')

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