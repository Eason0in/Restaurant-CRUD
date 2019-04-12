const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const port = 3000
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true })

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }), fileUpload())

app.get('/', (req, res) => {
  res.render('index')
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
