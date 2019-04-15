const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant.js')

//搜尋依餐廳、分類
router.get('/', (req, res) => {
  const keywordRegex = new RegExp(req.query.keyword, 'i')
  Restaurant.find(
    {
      $or: [{ name: { $regex: keywordRegex } }, { category: { $regex: keywordRegex } }]
    },
    (err, restaurants) => (err ? console.error(err) : res.render('index', { restaurants, keyword: req.query.keyword }))
  )
})
module.exports = router
