'use strict'
const bcrypt = require('bcryptjs')

module.exports = function getBcryptPassword(initPassword, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(initPassword, salt, (err, hash) => {
      callback(hash)
    })
  })
}
