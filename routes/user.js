'use strict'
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const getBcryptPassword = require('../public/javascripts/getBcryptPassword')

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

let errors = []
router.post('/register', (req, res) => {
  errors = []
  const { name, email, password, password2 } = req.body
  if (checkInput(email, password, password2)) {
    res.render('register', { name, email, password, password2, errors })
  } else {
    const newUser = new User()
    User.findOne({ email })
      .then(user => {
        if (!user) {
          Object.assign(newUser, { email, name })
          getBcryptPassword(password, insertData)
        } else {
          errors.push({ message: '該email已經註冊過了!' })
          res.render('register', { name, email, password, password2, errors })
        }
      })
      .catch(err => console.log(err))

    const insertData = bcryptPassword => {
      newUser.password = bcryptPassword
      newUser
        .save()
        .then(user => {
          res.redirect('/users/login')
        })
        .catch(err => console.log(err))
    }
  }
})

router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', '登出成功')
  res.redirect('/users/login')
})

const checkInput = (email, password, password2) => {
  if (!email || !password) {
    errors.push({ message: 'email、密碼欄位為必填' })
  }

  if (password !== password2) {
    errors.push({ message: '密碼不一致' })
  }

  errors.length > 0 ? true : false
}

module.exports = router
