module.exports = function(app) {
    var company = require('../controllers/company.controller');
    app.route('/company')
        .post(company.create)
        .get(company.list);
    app.route('/company/:id')
        .get(company.read)
        .put(company.update)
        .delete(company.delete);
    app.param('name', company.companyById);
};