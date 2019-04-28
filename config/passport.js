'use strict'
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const getBcryptPassword = require('../public/javascripts/getBcryptPassword')

module.exports = passport => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (!user) {
          return done(null, false, { message: 'The email is not register' })
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Email or Password incorrect' })
          }
        })
      })
    })
  )

  passport.use(
    new FacebookStrategy(
      {
        clientID: '2231014003623064',
        clientSecret: '8113a137be6f713851f215190df588db',
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        profileFields: ['displayName', 'email']
      },
      (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        const newUser = new User()

        User.findOne({ email }, (err, user) => {
          if (err) throw err
          if (!user) {
            const randomPassword = Math.random()
              .toString(36)
              .slice(-8)

            Object.assign(newUser, { email, name })

            getBcryptPassword(randomPassword, insertData)
          }
          return done(null, user)
        })

        const insertData = bcryptPassword => {
          newUser.password = bcryptPassword
          newUser
            .save()
            .then(user => {
              return done(null, user)
            })
            .catch(err => console.log(err))
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
