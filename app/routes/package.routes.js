module.exports = function(app) {
    var package = require('../controllers/package.controller');
    app.route('/package')
        .post(package.create)
        .get(package.list);
    app.route('/package/:name')
        .get(package.read)
        .put(package.update)
        .delete(package.delete);
    app.param('name', package.packageByname);
};