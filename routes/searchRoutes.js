/*
    ITSC 4155 - Group 3: "The Zoomers"
    Routes for searching functionality within the site (Search, searching with parameters, professor profile, professor details)
    Date: March 22nd, 2022

*/

const express = require("express");
const searchController = require("../controllers/searchController");
const filterMiddleware = require("../middlewares/routeFilter")
const searchRouter = express.Router();

//GET /search --> Search research page of website
searchRouter.get("/", searchController.getSearch);

searchRouter.post("/classes", searchController.execClassSearch)

searchRouter.get("/classes", searchController.getClassSearch)

searchRouter.post("/research", searchController.execResearchSearch)

searchRouter.get("/research", searchController.getResearchSearch)



//Provide the router to the app.js file
module.exports = searchRouter;
