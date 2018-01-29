process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var mongoose = require('./config/mongoose');
var express = require('./config/express');

var port = 5000;
var db = mongoose();
var app = express();
app.listen(port);

module.exports = app;

console.log('Server running at http://localhost:' + port);