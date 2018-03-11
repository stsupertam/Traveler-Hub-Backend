const multer  = require('multer');
const _  = require('lodash');
const Image = require('mongoose').model('Image')
const Dictionary = require('mongoose').model('Dictionary')

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './upload');
    },
    filename: function (req, file, callback) {
        var ext = ''; // set default extension (if any)
        if (file.originalname.split(".").length>1) // checking if there is an extension or not.
            ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
        callback(null, file.fieldname + '-' + Date.now() + ext);
    }
  });
var upload = multer({ storage : storage }).array('dictionary', 5);
exports.dictionaryImage = function(req, res, next) {
    console.log('Hello')
    console.log(req.query)
    upload(req, res, (err) => {
        if(err) {
            console.log(err)
            return res.end('Error uploading file.');
        }
        Image.insertMany(req.files)
            .then((images) => {
                var imageId = _.map(images, '_id')
                console.log(imageId)
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
    //upload(req, res)
    //    .then(() => {
    //        res.end('File is uploaded')
    //    })
    //    .catch((err) => {
    //        return res.end('Error uploading file.')
    //    })
}