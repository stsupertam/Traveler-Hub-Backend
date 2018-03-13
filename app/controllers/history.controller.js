const History = require('mongoose').model('History')

exports.updateHistory = function(req, res, next) {
    console.log('Hello')
    History.findOne({ email: req.body.email })
        .then((history) => {
            if(!history) {
                history = new History({ email: req.body.email, packageId: req.body._id })
                history.save()
                    .then(() => {
                        return res.json({ message: 'History successfully updated' })
                    })
                    .catch((err) => {
                        return next(err)
                    })
            } else {
                history.packageId.addToSet(req.body._id)
                history.save()
                    .then(() => {
                        return res.json({ message: 'History successfully updated' })
                    })
                    .catch((err) => {
                        return next(err)
                    })
            }
        })
        .catch((err) => {
            return next(err)
        })
}
