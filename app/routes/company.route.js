module.exports = function(app) {
    let company = require('../controllers/company.controller')
    app.route('/company')
        .post(company.create)
        .get(company.list)
    app.route('/company/:name')
        .get(company.read)
        .put(company.update)
        .delete(company.delete)
    app.param('name', company.companyByName)
}