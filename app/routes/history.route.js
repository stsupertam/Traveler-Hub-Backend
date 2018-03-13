module.exports = function(app) {
    var history = require('../controllers/history.controller')
    app.route('/history')
        .put(history.updateHistory)
}