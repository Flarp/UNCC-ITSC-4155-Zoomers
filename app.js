const express =  require('express')
const hbs = require('express-handlebars')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10

const { User } = require('./model/model.js')

const instance = hbs.create({
  extname: '.hbs',
  partialsDir: __dirname + '/views/partials'
})

const app = express()

app.use(express.static('public'))
app.engine('hbs', instance.engine)
app.set('view engine', 'hbs')
app.set('views', './views')

app.get('/', (req, res) => {
  //console.log(instance)
  res.render('index', {username: 'piss'})
})

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
