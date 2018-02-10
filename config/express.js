const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors')
const passport = require('passport')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


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
    app.set('view engine','ejs'); 
    app.use(bodyParser.json());
    app.use(passport.initialize())
    app.use(passport.session());
    app.use(cookieParser('secret'));
    app.use(session({cookie: { maxAge: 60000 }}));
    app.use(flash());
    app.use(cors());
    require('../app/routes/user.route')(app);
    require('../app/routes/package.route')(app);
    require('../app/routes/company.route')(app);
    require('../app/routes/chatbot.route')(app);
    require('../app/routes/auth.route')(app);
    require('../app/routes/index.route')(app);
    return app;
}