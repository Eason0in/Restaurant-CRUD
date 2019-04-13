const express = require('express')
const exphbs = require('express-handlebars')
const fileUpload = require('express-fileupload')
const Restaurant = require('./models/restaurant.js')

const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true })

const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }), fileUpload(), express.static('public'))
mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true, useFindAndModify: false })
const db = mongoose.connection

db.on('error', () => {
  console.log('db error!')
})

db.once('open', () => {
  console.log('db is connected!')
})

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

//GET詳細資料頁面
app.get('/detail/:_id', (req, res) => {
  Restaurant.findById(req.params._id, (err, restaurant) => {
    if (err) console.error(err)
    res.render('detail', { restaurant })
  })
})

//GET新增頁面
app.get('/add', (req, res) => {
  Restaurant.find((err, currentItem) => {
    const newId = currentItem.length + 1
    res.render('new', { _id: newId })
  })
})

//POST新增
app.post('/add', (req, res) => {
  const newRestaurant = Restaurant(req.body)
  if (req.files) {
    const uploadFile = req.files.uploadFile
    let imgUrl = `./public/img/${uploadFile.name}`
    newRestaurant.image = `../img/${uploadFile.name}`
    uploadFile.mv(imgUrl, function(err) {
      if (err) console.error(err)
    })
  }

  newRestaurant.save(err => {
    if (err) console.error(err)
    res.redirect('/')
  })
})

//POST刪除
app.post('/delete/:_id', (req, res) => {
  Restaurant.findByIdAndDelete(req.params._id, err => {
    if (err) console.error(err)
    res.redirect('/')
  })
})

//GET修改頁面
app.get('/edit/:_id', (req, res) => {
  Restaurant.findById(req.params._id, (err, restaurant) => {
    if (err) console.error(err)
    restaurant.imageStr = restaurant.image.split('/')[2]
    res.render('edit', { restaurant })
  })
})

//POST修改
app.post('/edit/:_id', (req, res) => {
  if (req.files) {
    const uploadFile = req.files.uploadFile
    let imgUrl = `./public/img/${uploadFile.name}`
    req.body.image = `../img/${uploadFile.name}`
    uploadFile.mv(imgUrl, function(err) {
      if (err) console.error(err)
    })
  }

  Restaurant.findByIdAndUpdate(req.body._id, req.body, err => {
    if (err) console.error(err)
    res.redirect('/')
  })
})

//監聽伺服器
app.listen(port, () => {
  console.log(`Start in http://localhost:${port}`)
})
