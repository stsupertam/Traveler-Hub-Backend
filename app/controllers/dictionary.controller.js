const Dictionary = require('mongoose').model('Dictionary')

exports.create = function(req, res, next) {
    let dictionary = new Dictionary(req.body)
    dictionary.save()
        .then(() => {
            return res.json({ message: 'Create dictionary successfully'})
        })
        .catch((err) => {
            return next(err)
        })
}

exports.update = function(req, res, next, id) {
    Dictionary.findOneAndUpdate({ _id: id }, req.body)
        .then((dictionary) => {
            return res.json(dictionary)
        })
        .catch((err) => {
            return res.json(err)
        })
}

exports.getDictionary = function(req, res, next) {
    Dictionary.findOne({})
        .populate('regions.images travel_types.images', 'filename -_id')
        .then((dictionary) => {
            for (item of dictionary.regions) {
                for (image of item.images) {
                    image.path = '/images/' + image.filename
                }
            }
            for (item of dictionary.travel_types) {
                for (image of item.images) {
                    image.path = '/images/' + image.filename
                }
            }
            return res.json(dictionary)
        })
        .catch((err) => {
            return next(err)
        })
}