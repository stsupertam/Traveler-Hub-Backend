const passport = require('passport')

module.exports = function(app) {
    let bookmark = require('../controllers/bookmark.controller')
    let auth = require('../controllers/auth.controller')
    app.route('/bookmark')
        .put(auth.verifySignature, bookmark.update)
        .get(auth.verifySignature, bookmark.display)
}