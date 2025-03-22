const passport = require("passport");

const jwtAuth = (req, res, next) => {
  // console.log("JWT Authentication started");
  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (err) {
      console.log("JWT Authentication error:", err);
      return next(err);
    }
    if (!user) {
      console.log("No user found, info:", info);
      res.status(401).json(info);
      return;
    }
    req.user = user;
    // console.log("User authenticated:", user);
    next();
  })(req, res, next);
};

module.exports = jwtAuth;
