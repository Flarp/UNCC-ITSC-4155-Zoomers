const mongoose = require('mongoose')

const user = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /\w+@\w+\.[a-zA-Z]{2,4}/
  },
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 15
  },
  password: {
    type: String,
    required: true
  }
})

exports.User = mongoose.model('User', user)
