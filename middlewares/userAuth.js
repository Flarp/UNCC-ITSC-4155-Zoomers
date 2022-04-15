const User = require('../model/model')

exports.isLoggedIn = async (req, res, next) => {
  if (req.session.account) {
    req.user = await User.findOne({ _id: req.session.account })
    next()
  } else {
    req.flash('error', 'You must be logged in to perform this action!')
    res.redirect('/user/login')
  }
}

exports.isGuest = (req, res, next) => {
  if (!req.session.account) {
    next()
  } else {
    req.flash('error', 'You are already logged in')
    res.redirect('/')
  }
}
