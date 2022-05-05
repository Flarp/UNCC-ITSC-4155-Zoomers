/*
    ITSC 4155 - Group 3: "The Zoomers"
    Routes for searching functionality within the site (Search, searching with parameters, professor profile, professor details)
    Date: March 22nd, 2022

*/

const express = require("express");
const searchController = require("../controllers/searchController");
const filterMiddleware = require("../middlewares/routeFilter")
const searchRouter = express.Router();

//GET /search --> Search professor page of website
searchRouter.get("/", searchController.getSearch);

//POST /search --> Fetch results based on query of the professor search page
searchRouter.post("/", searchController.execProfessorSearch);

//Post /search/classes --> Fetch results based on query of search
searchRouter.post("/classes", searchController.execClassSearch)

//GET /search/classes --> Get page that will search for professors via class
searchRouter.get("/classes", searchController.getClassSearch)

//Post /search/research --> Fetch results based on query of search in research page
searchRouter.post("/research", searchController.execResearchSearch)

//GET /search/research --> Get page that will search for professors via research
searchRouter.get("/research", searchController.getResearchSearch)

//Provide the router to the app.js file
module.exports = searchRouter;