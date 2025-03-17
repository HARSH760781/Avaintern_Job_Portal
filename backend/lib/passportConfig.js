const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require("../db/User");
const authKeys = require("./authKeys");

const filterJson = (obj, unwantedKeys) => {
  const filteredObj = {};
  Object.keys(obj).forEach((key) => {
    if (unwantedKeys.indexOf(key) === -1) {
      filteredObj[key] = obj[key];
    }
  });
  return filteredObj;
};

passport.use(
  new Strategy(
    {
      usernameField: "email", // Use email as the username field
      passReqToCallback: true, // Pass request to callback to access req
    },
    async (req, email, password, done) => {
      try {
        // console.log("Login attempt: ", email, password); // Log email and password
        //
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User does not exist" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        // console.log("Password Match:", isMatch); // Log whether password matches

        if (!isMatch) {
          return done(null, false, { message: "Password is incorrect" });
        }

        // Filter out sensitive information (password and __v)
        user["_doc"] = filterJson(user["_doc"], ["password", "__v"]);
        // console.log("User successfully authenticated:", user); // Log user object

        return done(null, user);
      } catch (err) {
        console.error("Error during login:", err);
        return done(err);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
      secretOrKey: authKeys.jwtSecretKey, // Secret key to verify JWT
    },
    (jwt_payload, done) => {
      // Find the user by ID from the JWT payload
      User.findById(jwt_payload._id)
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "JWT Token does not exist" });
          }

          // Filter out sensitive data (password, __v)
          user["_doc"] = filterJson(user["_doc"], ["password", "__v"]);
          return done(null, user);
        })
        .catch((err) => {
          return done(err, false, { message: "Incorrect Token" });
        });
    }
  )
);

module.exports = passport;
