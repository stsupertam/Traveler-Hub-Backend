const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')

module.exports = function() {
    var app = express()
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'))
    } else {
        app.use(compression)
    }
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit:50000
    }))
    app.set('view engine','ejs') 
    app.use(express.static('public'));
    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(express.static(__dirname + 'public'));
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(cors())
    app.use('/resources',express.static(__dirname + '/images'));
    require('../app/routes/user.route')(app)
    require('../app/routes/package.route')(app)
    require('../app/routes/company.route')(app)
    require('../app/routes/chatbot.route')(app)
    require('../app/routes/auth.route')(app)
    require('../app/routes/rating.route')(app)
    require('../app/routes/image.route')(app)
    require('../app/routes/dictionary.route')(app)
    require('../app/routes/index.route')(app)
    return app
}