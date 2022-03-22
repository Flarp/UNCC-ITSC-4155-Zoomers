/*
    ITSC 4155 - Group 3: "The Zoomers"
    Controller component for all functionalities relating to the main site. 
    Date: March 22nd, 2022

*/

//Get / index page
exports.index = (req, res) => {
    res.render("index");
};

//Get /contact contact page
exports.getContact = (req, res) => {
    res.render("contact");
}

//Get /search search research page
exports.getSearch = (req, res) => {
    res.render("search");
}

//Get /map campus map page
exports.getMap = (req, res) => {
    res.render("campusMap");
}

