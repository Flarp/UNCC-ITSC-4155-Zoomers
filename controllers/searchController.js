/*
    ITSC 4155 - Group 3: "The Zoomers"
    Controller component for all functionalities relating to the search portion of the website.
    Date: March 23rd, 2022

*/

const Professor = require("../model/professor.js")

//Get /search search research page
exports.getSearch = (req, res) => {
    res.render("search");
}

exports.getClassSearch = (req, res) => {
  res.render("search/searchClasses")
}

exports.execClassSearch = async (req, res) => {
  const professors = await Professor.find({ classes: { $elemMatch: { dept: req.body.class_id,  code: req.body.class_num } } })
  console.log(professors)
}

exports.execResearchSearch = async (req, res) => {
  const professors = await Professor.find({ researchAreas: req.body.researchArea })
}
