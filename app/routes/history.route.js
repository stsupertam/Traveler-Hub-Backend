module.exports = function(app) {
    let history = require('../controllers/history.controller')
    app.route('/history/:email')
        .get(history.read)
    app.route('/history/statistic/:company')
        .get(history.companyStatistic)
    app.param('email', history.historyByEmail)
}