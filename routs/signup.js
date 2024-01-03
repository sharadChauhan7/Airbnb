const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const myError = require("../utils/myErrors");
const user = require("../modal/user");
const passport = require("passport");

// Sign up user

router.get(
  "/signup",
  asyncWrap(async (req, res) => {
    res.render("user/signup", { who: "SignUP" });
  })
);

router.post(
  "/setUser",
  asyncWrap(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new user({ username, email });
      await user.register(newUser, password);
      req.flash("success", "Signed up");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

// Log in user

router.get(
  "/login",
  asyncWrap(async (req, res) => {
    res.render("user/login", { who: "Login" });
  })
);

router.post(
  "/setlogin",
  passport.authenticate(
    "local",
    { failureRedirect: "/login", failureFlash: true }
  ),
  async(req,res)=>{
    req.flash("success","Loged in");
    res.redirect('/listings');
  }
);

module.exports = router;
