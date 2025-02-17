const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js")

// signup route get and post together

router.route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.signup));

// signup route 

router.get("/signup", userController.renderSignup)
router.post("/signup", wrapAsync(userController.signup));


// login route get and post altogether

router.route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectUrl, passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }), userController.login);


// login route

router.get("/login", userController.renderLogin)
router.post("/login", saveRedirectUrl, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), userController.login)


router.get("/logout", userController.logout)


module.exports = router;