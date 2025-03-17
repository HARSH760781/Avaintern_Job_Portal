const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const JobApplicantInfo = require("../db/JobApplicant"); // Import the model

const router = express.Router();

// Set up Multer storage for resume and profile uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "resume") {
      cb(null, "./public/resume"); // Save resumes in the 'public/resume' folder
    } else if (file.fieldname === "profile") {
      cb(null, "./public/profile"); // Save profile images in the 'public/profile' folder
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Initialize the upload middleware
const upload = multer({ storage });

// Upload resume
router.post("/resume", upload.single("resume"), async (req, res) => {
  try {
    const userId = req.body.userId; // Assuming userId is sent in the request body
    const filePath = `/resume/${req.file.filename}`; // Get the file path

    // Update the JobApplicantInfo document with the resume file path
    await JobApplicantInfo.findOneAndUpdate(
      { userId },
      { resume: filePath },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Resume uploaded successfully", filePath });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Error uploading resume", error });
  }
});

// Upload profile image
router.post("/profile", upload.single("profile"), async (req, res) => {
  try {
    const userId = req.body.userId; // Assuming userId is sent in the request body
    const filePath = `/profile/${req.file.filename}`; // Get the file path

    // Update the JobApplicantInfo document with the profile file path
    await JobApplicantInfo.findOneAndUpdate(
      { userId },
      { profile: filePath },
      { new: true, upsert: true }
    );

    res
      .status(200)
      .json({ message: "Profile image uploaded successfully", filePath });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({ message: "Error uploading profile image", error });
  }
});

// Export both upload and router
module.exports = {
  upload,
  router,
};
