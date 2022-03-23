/*
    ITSC 4155 - Group 3: "The Zoomers"
    Routes for searching functionality within the site (Search, searching with parameters, professor profile, professor details)
    Date: March 22nd, 2022

*/

const express = require("express");
const searchController = require("../controllers/searchController");

const searchRouter = express.Router();

//GET /search --> Search research page of website
searchRouter.get("/", searchController.getSearch);

//Provide the router to the app.js file
module.exports = searchRouter;