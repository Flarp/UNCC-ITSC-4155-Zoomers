const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();



//GET /register --> Grab the register page
router.get("/register", userController.getRegister);

//Post /register --> Post the new register information to the server
router.post("/register", userController.createNewUser);

//GET /login --> Grab the login page
router.get("/login", userController.getLogin);

//Post /login --> Post the requested login from the user. Check their login against the database
router.post("/login", userController.checkLogin);

module.exports = router;