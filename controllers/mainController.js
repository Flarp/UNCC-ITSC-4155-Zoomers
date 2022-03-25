/*
    ITSC 4155 - Group 3: "The Zoomers"
    Controller component for all functionalities relating to the main site.
    Date: March 22nd, 2022

*/

const { User } = require("../model/model.js")
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

exports.getLogin = (req, res) => {
  res.render("login")
}

//Get /map campus map page
exports.getMap = (req, res) => {
  res.render("campusMap")
}

exports.login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username })
  if (!user) {
    console.log("bro what")
  } else {
    console.log()
    if (await bcrypt.compare(req.body.password, user.password)) {
      console.log("logged in!")
    } else {
      console.log("bro, you stink!")
    }
  }
}
exports.getProfProfile = (req, res) => {
  console.log(req)
  const { profId } = req.params
  const profData = {
    name: "John Doe",
    department: "Computer Science",
    researchAreas: ["Human-Computer Interaction", "CSE"],
    broadResearchAreas: ["Computer Science"],
    homePage: "https://passlab.github.io/yanyh/",
    email: "email@email.com",
    classes: [
      { dept: "College of Computing and Informatics", code: "ITSC 4155", name: "Software Engineering Projects" },
    ],
    reviews: [
      {
        userId: "1234",
        userName: "asdf",
        title: "Professor Review",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
    ],
  }

  res.render("profProfile", { profData })
}
