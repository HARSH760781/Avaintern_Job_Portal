const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs"); // For password hashing
const authKeys = require("../lib/authKeys");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");

const { upload } = require("./uploadRoutes");

const router = express.Router();

// Signup route with file uploads
router.post(
  "/signup",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profile", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      type,
      email,
      password,
      name,
      education,
      skills,
      bio,
      contactNumber,
      mobilePhone,
    } = req.body;

    let user; // Declare user variable outside the try block for rollback

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Clean the mobilePhone field
      const cleanMobilePhone = mobilePhone;
      // console.log(cleanMobilePhone);

      if (cleanMobilePhone.length !== 10) {
        return res.status(400).json({
          message: "Please provide a valid 10-digit phone number",
        });
      }

      // Create a new user
      const user = new User({
        email,
        password, // Save the hashed password
        type,
      });

      await user.save();

      // Get file paths
      const resumePath = req.files["resume"]
        ? `/resume/${req.files["resume"][0].filename}`
        : null;
      const profilePath = req.files["profile"]
        ? `/profile/${req.files["profile"][0].filename}`
        : null;

      // Create user details based on type
      const userDetails =
        type === "recruiter"
          ? new Recruiter({
              userId: user._id,
              name,
              contactNumber: cleanMobilePhone,
              bio,
            })
          : new JobApplicant({
              userId: user._id,
              name,
              education: JSON.parse(education), // Parse education array
              skills: JSON.parse(skills), // Parse skills array
              mobilePhone: cleanMobilePhone, // Use the cleaned phone number
              email,
              resume: resumePath, // Save the resume file path
              profile: profilePath, // Save the profile file path
            });

      await userDetails.save();

      // console.log("UserDetails:", userDetails);
      // Generate JWT token
      const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey, {
        expiresIn: "1d",
      });
      res.json({
        token,
        type: user.type,
        userId: user._id,
        name: userDetails.name,
        email: user.email,
      });
      // console.log("Token:", token);
    } catch (error) {
      console.error("Error during signup:", error);
      // console.log(User.length);
      if (user) {
        await User.deleteOne({ _id: user._id });
      }
      res
        .status(500)
        .json({ message: "Error during signup", error: error.message });
    }
  }
);

// Login route
router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        console.error("Error during authentication:", err); // Log authentication error
        return next(err);
      }
      if (!user) {
        console.log("Login failed:", info); // Log why login failed
        return res.status(401).json(info); // Send the error message
      }

      // Generate JWT token
      const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey, {
        expiresIn: "1d",
      });

      // console.log("User authenticated and token generated:", token); // Log the token
      res.json({
        token: token,
        type: user.type,
        userId: user._id,
        name: user.name,
        email: user.email,
      });
      // console.log(res.json);
    }
  )(req, res, next);
});

module.exports = router;
