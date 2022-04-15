const User = require("../model/model.js")

//Get /user/register --> Grab register page
exports.getRegister = (req, res) => {
  res.render("register")
}

//Post /user/register --> Register a new user to site if they meet requirements
exports.createNewUser = (req, res, next) => {
  //The new user will now be added to the model based on the information they pased in through the post request
  let newUser = new User(req.body)

  //Validate and save the user to the database.
  newUser
    .save()
    .then(() => {
      req.flash("success", "Account successfully created!")

      res.redirect("/user/login")
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        //Validation failed, user did not proper input
        req.flash("error", error.message)
        return res.redirect("/user/register")
      }

      if (error.code === 11000) {
        //User did not provide a unique username
        req.flash("error", "Email is already in use on the website!")
        return res.redirect("/user/register")
      }

      next(error)
    })
}

//Get /user/login render the login
exports.getLogin = (req, res) => {
  res.render("login")
}

//Post /user/login --> Check the login credintials against the database
exports.checkLogin = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((account) => {
      //If an account is found, then
      if (account) {
        //Check to see if the password of the found account matches the password stored for that account. Called the created method in the model. The compare is async. The result will be Boolean.
        account
          .comparePassword(req.body.password)
          .then((result) => {
            //If the result is true then the user is not capping and can login to their account. Otherwise the password was incorrect.
            if (result) {
              req.session.account = account._id //Store the account session id from the server into the browser cookie
              req.flash("success", "Successfully logged in.")
              res.redirect("/")
            } else {
              //Incorrect password entered by the user
              req.flash("error", "Incorrect username or password entered.")
              res.redirect("/user/login")
            }
          })
          .catch((error) => {
            //Error when comparing the passwords in the model
            console.log("Error when comparing passwords")
            next(error)
          })
      } else {
        //Incorrect email entered by the user
        req.flash("error", "Incorrect username or password entered.")
        res.redirect("/user/login")
      }
    })
    .catch((error) => {
      //Error locating the user account in the database.
      next(error)
    })
}

exports.addFavorite = async (req, res) => {
  const { userId, profId } = req.params
  const userData = await User.findOne({ _id: userId }).lean()
  userData.favorites.push(profId)
  userData.save() // FIXME not sure if this is the right way to save to DB
}
