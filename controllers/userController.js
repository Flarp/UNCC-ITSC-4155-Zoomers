const User = require("../model/model.js")
const Professor = require("../model/professor.js");

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
  User.findOne({ username: req.body.username }).then(account => {
    //If an account is found, then
    if(account) {
      //Check to see if the password of the found account matches the password stored for that account. Called the created method in the model. The compare is async. The result will be Boolean.
      account.comparePassword(req.body.password).then(result => {
          //If the result is true then the user is not capping and can login to their account. Otherwise the password was incorrect.
          if(result) {
              req.session.account = account._id;  //Store the account session id from the server into the browser cookie
              req.session.username = account.username
              req.flash("success", "Successfully logged in.");
              res.redirect("/");

          } else { //Incorrect password entered by the user
              req.flash("error", "Incorrect username or password entered.")
              res.redirect("/user/login");
          }
      }).catch(error => { //Error when comparing the passwords in the model
        console.log("Error when comparing passwords");
        next(error);
      });
    } else { //Incorrect email entered by the user
      req.flash("error", "Incorrect username or password entered.")
      res.redirect("/user/login");
    }
  }).catch(error => { //Error locating the user account in the database.
    next(error);
  });
}

//Get the user's profile, provide session data, grab user in database to get professor favorites
exports.getProfile = async (req, res) => {
  try {
    let userId = req.session.account;
    const userInfo = await User.findById(userId)
    const professors = [];

    //Retrieve favorites field from DB query
    const userFavsIds = userInfo.favorites;

    //Iterate through all favorite professor IDs, and retrieve them from the database... add to the array passed to front end.
    for(let i = 0; i < userFavsIds.length; i++) {
      const profObject = await Professor.findOne({ _id: userFavsIds[i] });
      professors.push(profObject);
    }

    //Render the profile with the user information and the professor favorite information
    res.render("profile", {user: req.user.toObject(), professors: professors.map(professor => professor.toObject())})
  } catch(error) {
    req.flash("error", error.message);
    res.redirect("back");
  }
}

exports.logout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err)
    } else {
      res.redirect("/")
    }
  })
}

exports.getPasswordReset = (req, res) => {
  res.render("password")
}

exports.execPasswordReset = (req, res, next) => {
  if (req.body.password !== req.body.confirmPassword) {
    req.flash('error', 'Passwords must match')
    return res.redirect("/user/password")
  }
  req.user.password = req.body.password
  req.user.save()
    .then(_ => {
      req.flash('success', 'Password successfully changed!')
      res.redirect("/user/profile")
    })
    .catch(error => {
      req.flash("error", "Error resetting password.");
      res.redirect("/user/profile");
    });
}

//Locate a specific user in the database. Add the requested professor to their favorites list.
exports.addFavorite = async (req, res) => {
  try {
    //Retrieve all needed information for queries.
    let userId = req.session.account;
    let profId = req.params.profId;

    //Query the database for a user. Add the requested professor to the favorites array.
    const userData = await User.findOne({ _id: userId })
    userData.favorites.push(profId);

    //Save the current iteration of the database back to mongo, redirect the user back to the professor page.
    userData.save().then(() => {
      res.redirect(`/professor/${profId}`)
    }).catch(error => { //Error exception for mongo error when removing professor
      req.flash("error", "An error has occurred when trying to favorite this professor.");
      res.redirect("back");
    });
  } catch(error) { //Error exception for mongo error when querying for a user
    req.flash("error", error.message);
    res.redirect(`/professor/${profId}`)
  }
}

//Locate a specific user in the database. Remove the requested professor from their favorites list.
exports.removeFavorite = async (req, res) => {
  try {
    //Retrieve needed information for queries.
    let userId = req.session.account;
    let profId = req.params.profId;

    //Query user database for user. Remove the requested professor from the array.
    const userData = await User.findOne({ _id: userId });
    
    if(userData.favorites.includes(profId)) {
      userData.favorites.splice(userData.favorites.indexOf(profId), 1);  
    }
  
    //Save the current iteration of the database back to mongo, redirect user back to the professor page.
    userData.save().then(() => {
      res.redirect(`/professor/${profId}`)
    }).catch(error => { //Error exception for mongo error when removing professor
      req.flash("error", "An error has occurred when trying to remove this professor.");
      res.redirect("back");
    });
  } catch(error) { //Error exception for mongo error when querying for a user
    req.flash("error", error.message);
    res.redirect(`/professor/${profId}`)
  }
}