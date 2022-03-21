const express =  require('express')
const hbs = require('express-handlebars')

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

app.listen(3000)
