const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const myError = require("../utils/myErrors");
const user = require("../modal/user");
const passport = require("passport");
const { saveRedirecturl } = require("../middleware/middleware");

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
      let result = await user.register(newUser, password);
      req.login(result, (err) => {
        if (err) {
          nextTick(err);
        }
        req.flash("success", "Signed up");
        res.redirect("/listings");
      });
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
  saveRedirecturl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Loged in");
    res.redirect(res.locals.redirectUrl || '/listings');
  }
);

// Logout user
router.get(
  "/logout",
  asyncWrap(async (req, res) => {
    req.logout((err) => {
      if (err) {
        throw myError(400, err.message);
      }
      req.flash("success", "Succesfully Loged out");
      res.redirect("/listings");
    });
  })
);

module.exports = router;
