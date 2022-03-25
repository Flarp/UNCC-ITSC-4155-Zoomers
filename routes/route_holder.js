/*
    ITSC 4155 - Group 3: "The Zoomers"
    Routes for main site navigation (Home page, Contact Page, Search functionality, campus map)
    Date: March 22nd, 2022

*/

const express = require("express");
const mainController = require("../controllers/mainController");

const mainRouter = express.Router();

//GET / --> index page (Home Page) of website
mainRouter.get("/", mainController.index);

//GET /contact --> Contact Page of website
mainRouter.get("/contact", mainController.getContact);

//GET /map --> Map of campus research
mainRouter.get("/map", mainController.getMap);

mainRouter.get("/login", mainController.getLogin)
mainRouter.get("/signup", mainController.getSignup)

mainRouter.post("/login", mainController.login)
mainRouter.post("/signup", mainController.signup)

//Provide the router to the app.js file
module.exports = mainRouter;

mainRouter.get("/profProfile", mainController.getProfProfile)