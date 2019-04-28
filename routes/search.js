const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant.js')
const sortInfos = require('../public/javascripts/sortInfos')

//搜尋依餐廳、分類
router.get('/', (req, res) => {
  const keywordRegex = new RegExp(req.query.keyword, 'i')
  Restaurant.find(
    {
      $and: [
        { userId: req.user._id },
        { $or: [{ name: { $regex: keywordRegex } }, { category: { $regex: keywordRegex } }] }
      ]
    },
    (err, restaurants) =>
      err
        ? console.error(err)
        : res.render('index', {
            restaurants,
            keyword: req.query.keyword,
            sortName: req.params.sortName,
            sortInfos
          })
  )
})
module.exports = router
