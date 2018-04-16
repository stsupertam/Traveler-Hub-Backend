const multer  = require('multer');
const _  = require('lodash');
const Image = require('mongoose').model('Image')
const User = require('mongoose').model('User')
const Dictionary = require('mongoose').model('Dictionary')

let storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '../images');
    },
    filename: function (req, file, callback) {
        let ext = ''; // set default extension (if any)
        if (file.originalname.split(".").length>1) // checking if there is an extension or not.
            ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
        callback(null, file.fieldname + '-' + Date.now() + ext);
    }
  });
let upload = multer({ storage : storage }).array('image', 5);

exports.upload = function(req, res, next) {
    upload(req, res, (err) => {
        if(err) {
            console.log(err)
            return res.end('Error uploading file.');
        }
        Image.insertMany(req.files)
            .then((image) => {
                return res.json({
                    message: 'Image uploaded successfully'
                })
            })
            .catch((err) => {
                console.log(err)
            })
    })
}
exports.userProfileUpload = function(req, res, next) {
    upload(req, res, (err) => {
        if(err) {
            console.log(err)
            return res.end('Error uploading file.');
        }
        Image.create(req.files)
            .then((image) => {
                let imageId = image[0]._id
                return User.findOneAndUpdate({ email: req.user.email }, 
                    { profileImage: imageId }, {new:true})
            })
            .then((user) => {
                return user.populate('profileImage', 'filename -_id').execPopulate()
            })
            .then((user) => {
                return res.json(user)
            })
            .catch((err) => {
                console.log(err)
            })
    })
}

exports.facebookProfileUpload = function(req, res, next) {
    User.findOne({ email: req.body.email })
        .populate('profileImage', 'path -_id')    
        .select('-password')
        .then((user) => {
            if(user) {
                req.user = user
                return next()
            } else {
                console.log(req.body.profileImage)
                let pattern = '\d.*.jpg'
                let filename = req.body.userId + '-' + req.body.firstname 
                let image = [{
                    'path': req.body.profileImage,
                    'filename': filename
                }]
                Image.insertMany(image)
                    .then((images) => {
                        let imageId = _.map(images, '_id')
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
                let imageId = _.map(images, '_id')
                if(req.query.name === 'region') {
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