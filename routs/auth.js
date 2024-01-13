const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const myError = require("../utils/myErrors");
const passport = require("passport");
const { saveRedirecturl } = require("../middleware/middleware");


const Listings = require("../controller/auth.js");

// Sign up user

router
  .route('/signup')
  .get(
    asyncWrap(Listings.getSignup)
  )
  .post(
    asyncWrap(Listings.postSignup)
  )


// Log in user

router
  .route('/login')
  .get(
    asyncWrap(Listings.getLogin)
  )
  .post(
    saveRedirecturl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    Listings.Login
  )

// Logout user
router.get(
  "/logout",
  asyncWrap(Listings.logout)
);

module.exports = router;
