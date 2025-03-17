const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/resume/:filename", (req, res) => {
  const filePath = path.join(
    __dirname,
    "../public/resume",
    req.params.filename
  );
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

router.get("/profile/:filename", (req, res) => {
  const filePath = path.join(
    __dirname,
    "../public/profile",
    req.params.filename
  );
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

module.exports = router;
