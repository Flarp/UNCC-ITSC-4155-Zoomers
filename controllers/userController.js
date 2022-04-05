const User = require("../model/model.js")

exports.getRegister = (req, res) => {
  res.render("register")
}

exports.createNewUser = (req, res, next) => {
    //The new user will now be added to the model based on the information they pased in through the post request
    let newUser = new User(req.body);

    //Validate and save the user to the database. 
    newUser.save().then(() => {
      console.log(newUser);
      console.log("Register Successful! Account Registered!");
      res.redirect("/user/login");
    }).catch(error => {
      if(error.name === "ValidationError") {
        //Validation failed, user did not proper input
        console.log("User entered incorrect information when registering!")
        return res.redirect("/user/register");
      }
  
      if (error.code === 11000) {
        //User did not provide a unique username
        console.log("User did not provide a unique username!")
        return res.redirect("/user/register");
      }
  
      console.log("Server Error when registering user to website.")
    });
}

//Get /login render the login
exports.getLogin = (req, res) => {
  res.render("login")
}

//Post /login --> Check the login credintials against the database
exports.checkLogin = (req, res, next) => {
  User.findOne({ username: req.body.username }).then(account => {
    //If an account is found, then
    if(account) {

      //Check to see if the password of the found account matches the password stored for that account. Called the created method in the model. The compare is async. The result will be Boolean.
      account.comparePassword(req.body.password).then(result => {
          //If the result is true then the user is not capping and can login to their account. Otherwise the password was incorrect.
          if(result) {
              req.session.account = account._id;  //Store the account session id from the server into the browser cookie
              console.log("Successful Login to application!")
              res.redirect("/");
              
          } else { //Incorrect password entered by the user
              console.log("Passwords did not match. Incorrect login");
              res.redirect("/user/login");
          }
      }).catch(error => { //Error when comparing the passwords in the model
        console.log("Error when comparing passwords");
        next(error);
      });
    } else { //Incorrect email entered by the user
      console.log("404: Email not found");
      res.redirect("/user/login");
    }
  }).catch(error => { //Error locating the user account in the database.
    next(error);
  });
}