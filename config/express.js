const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors')
const passport = require('passport')

module.exports = function() {
    var app = express()
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else {
        app.use(compression);
    }
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(passport.initialize())
    app.use(passport.session());
    app.use(bodyParser.json());
    app.use(cors());
    require('../app/routes/index.routes')(app);
    require('../app/routes/user.routes')(app);
    require('../app/routes/package.routes')(app);
    require('../app/routes/company.routes')(app);
    require('../app/routes/chatbot.routes')(app);
    return app;
}