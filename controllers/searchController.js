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

exports.execProfessorSearch = async (req, res) => {
  try {
    const professor = await Professor.find({ professor : req.body.profName });
    return res.redirect("/professor/" + professor[0].id);
  }catch(error) {
    if(error.name === "TypeError") { //TypeError occurs due to reading an undefined ID (Doesnt exist, meaning that user typed incorrect value)
      req.flash("error", "Professor not found, make sure to capitalize their first and last name and spell as listed on the UNCC directory.");
      return res.redirect("/search");
    }
  }
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
