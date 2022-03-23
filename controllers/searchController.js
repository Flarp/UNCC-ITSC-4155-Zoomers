/*
    ITSC 4155 - Group 3: "The Zoomers"
    Controller component for all functionalities relating to the search portion of the website.
    Date: March 23rd, 2022

*/

//Get /search search research page
exports.getSearch = (req, res) => {
    res.render("search");
}