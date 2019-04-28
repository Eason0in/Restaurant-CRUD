const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant.js')
const sortInfos = require('../public/javascripts/sortInfos')

//排序
router.get('/:sortCondition/:sortName', (req, res) => {
  Restaurant.find({ userId: req.user._id })
    .sort(req.params.sortCondition)
    .exec((err, restaurants) =>
      err ? console.error(err) : res.render('index', { restaurants, sortName: req.params.sortName, sortInfos })
    )
})

module.exports = router
