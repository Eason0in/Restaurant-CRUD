'use strict'
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const sortInfos = require('../public/javascripts/sortInfos')
const { authenticated } = require('../config/auth')

//首頁
router.get('/', authenticated, (req, res) => {
  Restaurant.find({ userId: req.user._id }, (err, restaurants) =>
    err ? console.error(err) : res.render('index', { restaurants, sortInfos })
  )
})

module.exports = router
