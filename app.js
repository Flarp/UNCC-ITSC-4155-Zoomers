/*
    ITSC 4155 - Group 3: "The Zoomers"
    ResearchMyProfessor application for 4155 Software Capstone project.
    Date: March 22nd, 2022

*/

const express =  require('express')
const hbs = require('express-handlebars')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10

const { User } = require('./model/model.js')
const mainRoutes = require("./routes/route_holder");

const instance = hbs.create({
  extname: '.hbs',
  partialsDir: __dirname + '/views/partials'
})

const app = express()

app.use(express.static('public'))
app.engine('hbs', instance.engine)
const host = "localhost";
let port = 3000;
app.set('view engine', 'hbs')
app.set('views', './views')

//Setup main routes of application, link to main routes
app.use("/", mainRoutes);

app.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username })
  if (!user) {
    console.log('bro what')
  } else {
    if (await bcrypt.compare(user.password, req.body.password)) {
      console.log('logged in!')
    } else {
      console.log('bro, you stink!')
    }
  }
})

mongoose.connect('mongodb://localhost:27017/researchmyprofessor').then(_ => {
  app.listen(3000)
})
