'use strict'
const express = require('express')
const exphbs = require('express-handlebars')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(express.static('public'))
app.use(methodOverride('_method'))
mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true, useFindAndModify: false })
const db = mongoose.connection

db.on('error', () => console.log('db error!'))
db.once('open', () => console.log('db is connected!'))

app.use('/', require('./routes/home'))
app.use('/restaurants', require('./routes/restaurant'))
app.use('/sort', require('./routes/sort'))
app.use('/search', require('./routes/search'))

//監聽伺服器
app.listen(port, () => console.log(`Start in http://localhost:${port}`))
