module.exports = function(app) {
    var package = require('../controllers/package.controller');
    app.route('/package')
        .post(package.create)
        .get(package.list);
    app.route('/package/latest')
        .get(package.latest);
    app.route('/package/popular')
        .get(package.popular);
    app.route('/package/:id')
        .get(package.read)
        .put(package.update)
        .delete(package.delete);
    app.param('id', package.packageById);
};