const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant.js')
const sortInfosArray = require('../public/javascripts/sortInfosArray')

//排序
router.get('/:sortCondition/:sortName', (req, res) => {
  Restaurant.find()
    .sort(req.params.sortCondition)
    .exec((err, restaurants) =>
      err ? console.error(err) : res.render('index', { restaurants, sortName: req.params.sortName, sortInfosArray })
    )
})

module.exports = router
