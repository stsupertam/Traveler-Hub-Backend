module.exports = function(app) {
    let history = require('../controllers/history.controller')
    let auth = require('../controllers/auth.controller')
    app.route('/history/:email')
        .get(history.read)
    app.param('email', history.historyByEmail)
}