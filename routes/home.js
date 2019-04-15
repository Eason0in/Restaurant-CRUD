const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

//首頁
router.get('/', (req, res) => {
  Restaurant.find((err, restaurants) => (err ? console.error(err) : res.render('index', { restaurants })))
})
module.exports = router
