const user = require("../modal/user");

module.exports.getSignup = async (req, res) => {
    res.render("user/signup", { who: "SignUP" });
};

module.exports.postSignup = async (req, res) => {
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
};

module.exports.getLogin = async (req, res) => {
    res.render("user/login", { who: "Login" });
};

module.exports.Login = async (req, res) => {
    req.flash("success", "Loged in");
    if(res.locals.redirectUrl){
      res.locals.redirectUrl=res.locals.redirectUrl.replace('/review','/show');
    }
    res.redirect(res.locals.redirectUrl || '/listings');
};

module.exports.logout = async (req, res) => {
    req.logout((err) => {
      if (err) {
        throw myError(400, err.message);
      }
      req.flash("success", "Succesfully Loged out");
      res.redirect("/listings");
    });
};