var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var cors = require('cors')

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
    app.use(bodyParser.json());
    app.use(cors());
    require('../app/routes/index.routes')(app);
    require('../app/routes/user.routes')(app);
    require('../app/routes/package.routes')(app);
    return app;
}