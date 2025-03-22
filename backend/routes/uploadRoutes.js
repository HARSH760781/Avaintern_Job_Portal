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
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
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
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
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
router.put(
  "/user",
  upload.fields([{ name: "profile" }, { name: "resume" }]),
  async (req, res) => {
    try {
      const userId = req.body.userId;
      const profileDetails = JSON.parse(req.body.profileDetails);

      // Update profile details in the database
      const updateData = { ...profileDetails };

      if (req.files.profile) {
        updateData.profile = `/profile/${req.files.profile[0].filename}`;
      }
      if (req.files.resume) {
        updateData.resume = `/resume/${req.files.resume[0].filename}`;
      }

      await JobApplicantInfo.findOneAndUpdate({ userId }, updateData, {
        new: true,
        upsert: true,
      });

      res
        .status(200)
        .json({ message: "Profile updated successfully", data: updateData });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Error updating profile", error });
    }
  }
);

// Export both upload and router
module.exports = {
  upload,
  router,
};
