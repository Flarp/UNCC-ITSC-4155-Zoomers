/*
    ITSC 4155 - Group 3: "The Zoomers"
    Controller component for all functionalities relating to the main site.
    Date: March 22nd, 2022

*/

const { User } = require('../model/model.js')
const bcrypt = require('bcrypt')

//Get / index page
exports.index = (req, res) => {
    res.render("index");
};

//Get /contact contact page
exports.getContact = (req, res) => {
    res.render("contact");
}

//Get /search search research page
exports.getSearch = (req, res) => {
    res.render("search");
}

exports.getLogin = (req, res) => {
  res.render("login")
}

//Get /map campus map page
exports.getMap = (req, res) => {
    res.render("campusMap");
}

exports.login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username })
  if (!user) {
    console.log('bro what')
  } else {
    console.log()
    if (await bcrypt.compare(req.body.password, user.password)) {
      console.log('logged in!')
    } else {
      console.log('bro, you stink!')
    }
  }
}
