const express = require("express");
const userController = require("../controllers/userController");
const userMiddleware = require("../middlewares/userAuth")

const router = express.Router();

//GET /register --> Grab the register page
router.get("/register", userMiddleware.isGuest, userController.getRegister);

//Post /register --> Post the new register information to the server
router.post("/register", userMiddleware.isGuest, userController.createNewUser);

//GET /login --> Grab the login page
router.get("/login", userMiddleware.isGuest, userController.getLogin);

//Post /login --> Post the requested login from the user. Check their login against the database
router.post("/login", userMiddleware.isGuest, userController.checkLogin);

// GET /profile --> View the user's profile page
router.get("/profile", userMiddleware.isLoggedIn, userController.getProfile)

// POST /logout --> Log the user out
router.get("/logout", userMiddleware.isLoggedIn, userController.logout)

router.get("/password", userMiddleware.isLoggedIn, userController.getPasswordReset)

router.post("/password", userMiddleware.isLoggedIn, userController.execPasswordReset)

router.post("/addFavorite/:profId", userMiddleware.isLoggedIn, userController.addFavorite);

router.post("/removeFavorite/:profId", userMiddleware.isLoggedIn, userController.removeFavorite);

module.exports = router;
