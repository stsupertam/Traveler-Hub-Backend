process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const mongoose = require('./config/mongoose')
const express = require('./config/express')
const passport = require('./config/passport')

let port = 5000
let db = mongoose()
let app = express()
let auth = passport()
app.listen(port)

module.exports = app

console.log('Server running at http://localhost:' + port)