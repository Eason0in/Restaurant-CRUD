'use strict'
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })(req, res, next)
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  User.findOne({ email })
    .then(user => {
      if (!user) {
        const newUser = new User({ name, email, password })
        newUser.save().then(user => {
          res.render('login')
        })
      } else {
        res.render('register')
      }
    })
    .catch(err => console.log(err))
})

module.exports = router
