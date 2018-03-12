const multer  = require('multer');
const _  = require('lodash');
const Image = require('mongoose').model('Image')
const User = require('mongoose').model('User')
const Dictionary = require('mongoose').model('Dictionary')

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images');
    },
    filename: function (req, file, callback) {
        var ext = ''; // set default extension (if any)
        if (file.originalname.split(".").length>1) // checking if there is an extension or not.
            ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
        callback(null, file.fieldname + '-' + Date.now() + ext);
    }
  });
var upload = multer({ storage : storage }).array('dictionary', 5);

exports.facebookProfileUpload = function(req, res, next) {
    User.findOne({ email: req.body.email })
        .populate('profileImage', 'path -_id')    
        .select('-password')
        .then((user) => {
            if(user) {
                req.user = user
                return next()
            } else {
                var pattern = '\d.*.jpg'
                var filename = req.body.profileImage.split('/').slice(-1)[0].match('.*.jpg')[0]
                var image = [{
                    'path': req.body.profileImage,
                    'filename': filename
                }]
                Image.insertMany(image)
                    .then((images) => {
                        var imageId = _.map(images, '_id')
                        req.body.profileImage = imageId
                        return next()
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

exports.dictionaryImage = function(req, res, next) {
    upload(req, res, (err) => {
        if(err) {
            console.log(err)
            return res.end('Error uploading file.');
        }
        Image.insertMany(req.files)
            .then((images) => {
                var imageId = _.map(images, '_id')
                if(req.query.name === 'dictionay') {
                    return Dictionary.findOneAndUpdate({ 'regions.region': req.query.item }, 
                        { $push: { 'regions.$.images': { '$each': imageId }}
                    })
                } else {
                    return Dictionary.findOneAndUpdate({ 'travel_types.travel_type': req.query.item }, 
                        { $push: { 'travel_types.$.images': { '$each': imageId }}
                    })
                }
            })
            .then((dictionary) => {
                console.log(dictionary)
                return res.end('File is uploaded')
            })
            .catch((err) => {
                console.log(err)
            })
    })
}