/*
    ITSC 4155 - Group 3: "The Zoomers"
    Routes for main site navigation (Home page, Contact Page, Search functionality, campus map)
    Date: March 22nd, 2022

*/

const express = require("express")
const mainController = require("../controllers/mainController")
const userMiddleware = require("../middlewares/userAuth.js")

const mainRouter = express.Router()

//GET / --> index page (Home Page) of website
mainRouter.get("/", mainController.index)

//GET /api/data --> Grab data from the database to visualize
mainRouter.get("/api/data", mainController.getData);

//GET /contact --> Contact Page of website
mainRouter.get("/contact", mainController.getContact)

//GET /map --> Map of campus research
mainRouter.get("/map", mainController.getMap)

//Get /professor/:id --> Retrieve the profile of the professor
mainRouter.get("/professor/:profId", mainController.getProfProfile)

mainRouter.post("/professor/:profId", userMiddleware.isLoggedIn, mainController.addReview)

//Provide the router to the app.js file
module.exports = mainRouter
