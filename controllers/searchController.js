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

exports.getResearchSearch = (req, res) => {
  res.render("search/searchResearch")
}

exports.execClassSearch = async (req, res) => {
  const professors = await Professor.find({ classes: { $elemMatch: { dept: req.body.class_id,  code: req.body.class_num } } })
  const req_class = professors.length !== 0 ? professors[0].classes.find(prof_class => prof_class.dept === req.body.class_id && prof_class.code === req.body.class_num).toObject() : false
  res.render("search/professorResearchResults", {research: false, class: req_class, professors: professors.map(professor => professor.toObject())})
}

exports.execResearchSearch = async (req, res) => {
  const professors = await Professor.find({ researchAreas: req.body.researchArea })
  res.render("search/professorResearchResults", {research: req.body.researchArea, class: false, professors: professors.map(professor => professor.toObject())})
}
