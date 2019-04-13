const express = require('express')
const exphbs = require('express-handlebars')
const fileUpload = require('express-fileupload')
const Restaurant = require('./models/restaurant.js')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }), fileUpload(), express.static('public'))
mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true })

app.get('/', (req, res) => {
  Restaurant.find((err, restaurants) => {
    res.render('index', { restaurants })
  })
})

app.post('/add', (req, res) => {
  const uploadFile = req.files.uploadFile
  uploadFile.mv(`./public/img/${uploadFile.name}`, function(err) {
    if (err) return res.status(500).send(err)
  })

  console.log(req.body.name)
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Start in http://localhost:${port}`)
})
