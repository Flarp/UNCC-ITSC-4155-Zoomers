/*
    ITSC 4155 - Group 3: "The Zoomers"
    Controller component for all functionalities relating to the main site.
    Date: March 22nd, 2022

*/

const User = require("../model/model.js")
const Professor = require("../model/professor.js")
const bcrypt = require("bcrypt")
const scrapingFunctions = require("../model/scraping")

//Get / index page
exports.index = (req, res) => {
  //Retrieve the async function from the scraper function.
  const executeScrape = scrapingFunctions.getResearchHeadlines

  //Execute the async function and return the promise to the
  const scrapeNewsPromise = executeScrape()

  //Consume the promise returned from the async function... retrieve news information object
  scrapeNewsPromise
    .then((newsDataArray) => {
      //console.log(newsDataArray);
      res.render("index", { newsDataArray })
    })
    .catch((error) => {
      //Error occurred when consuming promise?
      console.log(
        "An error has occurred when retreiving the data object from the scrap.\n" +
          error.message
      )
    })
}

//Get /contact contact page
exports.getContact = (req, res) => {
  res.render("contact")
}


exports.getRegister = (req, res) => {
  res.render("register")
}

exports.createNewUser = (req, res, next) => {

    console.log('dos this part even run?')
    
    console.log(req.body);
    //The new user will now be added to the model based on the information they pased in through the post request
    let newUser = new User(req.body);

    //Validate and save the user to the database. 
    newUser.save().then(() => {
      console.log(newUser);
      console.log("Register Successful! Account Registered!");
      res.redirect("/login");
    }).catch(error => {
      if(error.name === "ValidationError") {
        //Validation failed, user did not proper input
        console.log("User entered incorrect information when registering!")
        return res.redirect("/register");
      }
  
      if (error.code === 11000) {
        //User did not provide a unique username
        console.log("User did not provide a unique username!")
        return res.redirect("/register");
      }
  
      console.log("Server Error when registering user to website.")
    });
}

//Get /map campus map page
exports.getMap = (req, res) => {
  res.render("campusMap")
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
              res.redirect("/login");
          }
      }).catch(error => { //Error when comparing the passwords in the model
        console.log("Error when comparing passwords");
        next(error);
      });
    } else { //Incorrect email entered by the user
      console.log("404: Email not found");
      res.redirect("/login");
    }
  }).catch(error => { //Error locating the user account in the database.
    next(error);
  });
}

exports.getProfProfile = async (req, res) => {
  //console.log(req)
  const { profId } = req.params
  const profData = await Professor.findOne({ _id: profId }).lean()

  res.render("profProfile", { profData })
}
