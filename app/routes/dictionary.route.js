module.exports = function(app) {
    var dictionary = require('../controllers/dictionary.controller')
    app.route('/dictionary')
        .post(dictionary.create)
        .get(dictionary.getDictionary)
}