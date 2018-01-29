const passport = require('passport')

module.exports = function() {
    require('./strategies/local.js')();
    require('./strategies/jwt.js')();
}