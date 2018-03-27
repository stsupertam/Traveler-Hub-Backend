module.exports = function(app) {
    let history = require('../controllers/history.controller')
    app.route('/history/:email')
        .get(history.read)
    app.route('/history/report/:company')
        .get(history.report)
    app.param('email', history.historyByEmail)
}