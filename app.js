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

//首頁
app.get('/', (req, res) => {
  Restaurant.find((err, restaurants) => {
    res.render('index', { restaurants })
  })
})

//搜尋依餐廳、分類
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const searchRegex = new RegExp(keyword, 'i')
  Restaurant.find(
    {
      $or: [{ name: { $regex: searchRegex } }, { category: { $regex: searchRegex } }]
    },
    (err, restaurants) => {
      res.render('index', { restaurants, keyword })
    }
  )
})

//詳細資料頁面
app.get('/detail/:_id', (req, res) => {
  Restaurant.findById(req.params._id, (err, restaurant) => {
    if (err) console.error(err)
    res.render('detail', { restaurant })
  })
})

//新增頁面
app.post('/add', (req, res) => {
  const uploadFile = req.files.uploadFile
  uploadFile.mv(`./public/img/${uploadFile.name}`, function(err) {
    if (err) return res.status(500).send(err)
  })
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Start in http://localhost:${port}`)
})
