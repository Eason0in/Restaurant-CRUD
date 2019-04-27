const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant.js')
const Handlebars = require('handlebars')
const getStartsHtml = require('../public/javascripts/getStartsHtml')
const path = require('path')
const { authenticated } = require('../config/auth')

//GET詳細資料頁面
router.get('/detail/:_id', authenticated, (req, res) => {
  Restaurant.findOne({ _id: req.params._id, userId: req.user._id }, (err, restaurant) => {
    if (err) console.error(err)
    const encodeURILocation = encodeURIComponent(restaurant.location)
    restaurant.googleMapUrl = `
    https://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&q=${encodeURILocation}&z=16&output=embed&t=`
    res.render('detail', { restaurant })
  })
})

//GET新增頁面
router.get('/add', authenticated, (req, res) => {
  Restaurant.find({ userId: req.user._id }, (err, restaurants) => {
    if (err) console.error(err)
    res.render('new')
  })
})

//POST新增
router.post('/add', authenticated, (req, res) => {
  const newRestaurant = Restaurant(req.body)
  newRestaurant.userId = req.user._id
  //把圖片搬到public.img底下
  if (req.files) {
    const { uploadFile } = req.files
    const imgUrl = `./public/img/${uploadFile.name}`
    newRestaurant.image = `/img/${uploadFile.name}`
    uploadFile.mv(imgUrl, err => {
      if (err) console.error(err)
    })
  }

  //新餐廳存檔
  newRestaurant.save(err => (err ? console.error(err) : res.redirect('/')))
})

//POST刪除
router.delete('/delete/:_id', authenticated, (req, res) =>
  Restaurant.findOneAndDelete({ _id: req.params._id, userId: req.user._id }, err =>
    err ? console.error(err) : res.redirect('/')
  )
)

//GET修改頁面
router.get('/edit/:_id', authenticated, (req, res) => {
  Restaurant.findOne({ _id: req.params._id, userId: req.user._id }, (err, restaurant) => {
    if (err) console.error(err)
    restaurant.imageStr = path.basename(restaurant.image, '.jpg')
    res.render('edit', { restaurant })
  })
})

//POST修改
router.put('/edit/:_id', authenticated, (req, res) => {
  //把圖片搬到public.img底下
  if (req.files) {
    const { uploadFile } = req.files
    const imgUrl = `./public/img/${uploadFile.name}`
    req.body.image = `/img/${uploadFile.name}`
    uploadFile.mv(imgUrl, err => {
      if (err) console.error(err)
    })
  }

  //更新資料
  Restaurant.findOneAndUpdate({ _id: req.params._id, userId: req.user._id }, req.body, err =>
    err ? console.error(err) : res.redirect('/')
  )
})

//依照評分產生星星
Handlebars.registerHelper('times', startsNum => {
  const yellowNum = Math.floor(startsNum)
  const grayNum = Math.floor(5 - startsNum)
  const decimalNum = (startsNum - yellowNum).toFixed(1)
  return getStartsHtml(yellowNum, decimalNum, grayNum)
})

module.exports = router
