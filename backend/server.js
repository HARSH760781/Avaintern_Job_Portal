const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const passportConfig = require("./lib/passportConfig");
const cors = require("cors");
const fs = require("fs");
const { router: uploadRoutes } = require("./routes/uploadRoutes");
const userRoutes = require("./routes/apiRoutes");
require("dotenv").config();

// MongoDB

const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// initialising directories
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}
if (!fs.existsSync("./public/resume")) {
  fs.mkdirSync("./public/resume");
}
if (!fs.existsSync("./public/profile")) {
  fs.mkdirSync("./public/profile");
}

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Setting up middlewares
app.use(
  cors({
    origin: "*",
    credentials: true, // Allow cookies and credentials
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  })
);

app.use(
  "/resume",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static(path.join(__dirname, "public/resume"))
);
app.use("/profile", express.static(path.join(__dirname, "public/profile")));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(passportConfig.initialize());
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, "build")));

// Routing

app.use("/auth", require("./routes/authRoutes"));
app.use("/api", userRoutes);
app.use("/upload", uploadRoutes);
app.use("/host", require("./routes/downloadRoutes"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
