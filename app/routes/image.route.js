module.exports = function(app) {
    let image = require('../controllers/image.controller')
    let auth = require('../controllers/auth.controller')
    app.route('/upload/dictionary')
        .post(image.dictionaryImage)
    app.route('/upload/profile')
        .post(auth.verifySignature, image.userProfileUpload)
    app.route('/upload/image')
        .post(image.upload)
}