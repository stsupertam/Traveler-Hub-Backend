module.exports = function(app) {
    var image = require('../controllers/image.controller')
    app.route('/upload/dictionary')
        .post(image.dictionaryImage)

}