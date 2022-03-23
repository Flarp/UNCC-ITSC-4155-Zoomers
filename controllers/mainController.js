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

//Get /map campus map page
exports.getMap = (req, res) => {
    res.render("campusMap");
}

exports.login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username })
  if (!user) {
    console.log('bro what')
  } else {
    if (await bcrypt.compare(user.password, req.body.password)) {
      console.log('logged in!')
    } else {
      console.log('bro, you stink!')
    }
  }
}
