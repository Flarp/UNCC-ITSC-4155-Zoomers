/*
    ITSC 4155 - Group 3: "The Zoomers"
    ResearchMyProfessor application for 4155 Software Capstone project.
    Date: March 22nd, 2022

*/

const express = require("express")
const hbs = require("express-handlebars")
const mongoose = require("mongoose")
const MongoStore = require("connect-mongo")
const session = require("express-session")
const flash = require("connect-flash")

const SALT_ROUNDS = 10

const { User } = require("./model/model.js")
const mainRoutes = require("./routes/route_holder")
const searchRoutes = require("./routes/searchRoutes")
const userRoutes = require("./routes/userRoutes")

const instance = hbs.create({
  extname: ".hbs",
  partialsDir: __dirname + "/views/partials",
})

const app = express()

app.engine("hbs", instance.engine)
const host = "localhost"
let port = 3000
app.set("view engine", "hbs")
app.set("views", "./views")

mongoose
  .connect("mongodb://localhost:27017/researchmyprofessor")
  .then((_) => {
    app.listen(port, host, () => {
      console.log("Server is running on port", port)
    })
  })
  .catch((error) => console.log(error.message))

//Mount Middleware
app.use(express.static("public"))
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(
  session({
    secret: "4155-SoftwareDev",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, //Lifetime of an hour. Mins * seconds * 1000 (This is 1 hour)
    store: new MongoStore({
      mongoUrl: "mongodb://localhost:27017/researchmyprofessor",
    }), //Sessions will now be connected to our mongoDB server and store that information along with other info. Collection by default is named sessions
  })
)

//Establish flash messages
app.use(flash())

//Divide up different flash responses, store these into res local variables that will be used in the template engine
app.use((req, res, next) => {
  //Store success and error messages into res object (locals)
  res.locals.successMessages = req.flash("success")
  res.locals.errorMessages = req.flash("error")
  next()
})

//Setup main routes of application, link to main routes
app.use("/", mainRoutes)

//Setup search routes of application, link to search routes
app.use("/search", searchRoutes)

//Setup user routes of application, link to user routes
app.use("/user", userRoutes)
