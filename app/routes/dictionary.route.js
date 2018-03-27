module.exports = function(app) {
    let dictionary = require('../controllers/dictionary.controller')
    app.route('/dictionary')
        .post(dictionary.create)
        .get(dictionary.getDictionary)
}