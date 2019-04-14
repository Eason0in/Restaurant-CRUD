'use strict'
const express = require('express')
const exphbs = require('express-handlebars')
const fileUpload = require('express-fileupload')
const Restaurant = require('./models/restaurant.js')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
require('handlebars-helpers')({ handlebars: Handlebars })
const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }), fileUpload(), express.static('public'))
mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true, useFindAndModify: false })
const db = mongoose.connection

db.on('error', () => console.log('db error!'))

db.once('open', () => console.log('db is connected!'))

//首頁
app.get('/', (req, res) => {
  Restaurant.find((err, restaurants) => (err ? console.error(err) : res.render('index', { restaurants })))
})

//搜尋依餐廳、分類
app.get('/search', (req, res) => {
  const keywordRegex = new RegExp(req.query.keyword, 'i')
  Restaurant.find(
    {
      $or: [{ name: { $regex: keywordRegex } }, { category: { $regex: keywordRegex } }]
    },
    (err, restaurants) => (err ? console.error(err) : res.render('index', { restaurants, keyword: req.query.keyword }))
  )
})

//GET詳細資料頁面
app.get('/detail/:_id', (req, res) => {
  Restaurant.findById(req.params._id, (err, restaurant) => {
    if (err) console.error(err)
    restaurant.locationStr = restaurant.location.split(' ').join('+')
    res.render('detail', { restaurant })
  })
})

//GET新增頁面
app.get('/add', (req, res) => {
  Restaurant.find((err, restaurants) => {
    if (err) console.error(err)
    const newId = restaurants.length + 1
    res.render('new', { _id: newId })
  })
})

//POST新增
app.post('/add', (req, res) => {
  const newRestaurant = Restaurant(req.body)

  //把圖片搬到public.img底下
  if (req.files) {
    const { uploadFile } = req.files
    const imgUrl = `./public/img/${uploadFile.name}`
    newRestaurant.image = `../img/${uploadFile.name}`
    uploadFile.mv(imgUrl, err => {
      if (err) console.error(err)
    })
  }

  //新餐廳存檔
  newRestaurant.save(err => (err ? console.error(err) : res.redirect('/')))
})

//POST刪除
app.post('/delete/:_id', (req, res) =>
  Restaurant.findByIdAndDelete(req.params._id, err => (err ? console.error(err) : res.redirect('/')))
)

//GET修改頁面
app.get('/edit/:_id', (req, res) => {
  Restaurant.findById(req.params._id, (err, restaurant) => {
    if (err) console.error(err)
    restaurant.imageStr = restaurant.image.split('/').find(imgUrl => imgUrl.includes('.jpg'))
    res.render('edit', { restaurant })
  })
})

//POST修改
app.post('/edit/:_id', (req, res) => {
  //把圖片搬到public.img底下
  if (req.files) {
    const { uploadFile } = req.files
    const imgUrl = `./public/img/${uploadFile.name}`
    req.body.image = `../img/${uploadFile.name}`
    uploadFile.mv(imgUrl, err => {
      if (err) console.error(err)
    })
  }

  //更新資料
  Restaurant.findByIdAndUpdate(req.body._id, req.body, err => (err ? console.error(err) : res.redirect('/')))
})

//監聽伺服器
app.listen(port, () => console.log(`Start in http://localhost:${port}`))

//依照評分產生星星
Handlebars.registerHelper('times', startsNum => {
  const yellowNum = Math.floor(startsNum)
  const grayNum = Math.floor(5 - startsNum)
  const decimalNum = (startsNum - yellowNum).toFixed(1)
  return getStartsHtml(yellowNum, decimalNum, grayNum)
})

//產生星星HTML
function getStartsHtml(yellowNum, decimalNum, grayNum) {
  const startInfosMap = [
    { color: 'yellow', num: yellowNum },
    { color: null, num: decimalNum },
    { color: 'gray', num: grayNum }
  ]

  const startsHtml = startInfosMap
    .map(item => {
      const { color, num } = item
      if (color) {
        return `<span class="star"><i class="fa fa-star fa-star-${color}"></i></span>`.repeat(num)
      } else {
        return `
          <span class="star star-percentage">
            <i class="fa fa-star fa-star-gray"></i>
            <i class="fa fa-star fa-star-yellow percent-star" style="width: ${num * 100}%;"></i>
          </span>`
      }
    })
    .join('')

  return startsHtml
}
