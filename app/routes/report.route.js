module.exports = function(app) {
    let report = require('../controllers/report.controller')
    let auth = require('../controllers/auth.controller')
    app.route('/report/history')
        .get(auth.verifySignature, report.reportHistory)
    app.route('/report/history/views')
        .get(auth.verifySignature, report.reportViewTotal)
    app.route('/report/favorite')
        .get(auth.verifySignature, report.reportFavorite)
    app.route('/report/most')
        .get(auth.verifySignature, report.most)
    app.route('/report/package')
        .get(auth.verifySignature, report.package)

}
