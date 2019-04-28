'use strict'
const express = require('express')
const exphbs = require('express-handlebars')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const app = express()
const port = 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(session({ secret: 'ddd123', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true, useFindAndModify: false })
const db = mongoose.connection

db.on('error', () => console.log('db error!'))
db.once('open', () => console.log('db is connected!'))

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

require('./config/passport')(passport)

app.use('/', require('./routes/home'))
app.use('/restaurants', require('./routes/restaurant'))
app.use('/sort', require('./routes/sort'))
app.use('/search', require('./routes/search'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auth'))

//監聽伺服器
app.listen(port, () => console.log(`Start in http://localhost:${port}`))
