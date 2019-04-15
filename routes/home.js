const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const sortInfosArray = require('../public/javascripts/sortInfosArray')

//首頁
router.get('/', (req, res) => {
  Restaurant.find((err, restaurants) =>
    err ? console.error(err) : res.render('index', { restaurants, sortInfosArray })
  )
})

module.exports = router
