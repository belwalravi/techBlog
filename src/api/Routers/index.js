require("dotenv").config();
const express = require("express");

const router = express.Router();

const authRoute = require("./auth");
const storyRoute = require("./story");
const userRoute = require("./user");
const commentRoute = require("./comment");

app.use((req, res, next) => {
    console.log(`API requested: ${req.method} ${req.url}`);
    next(); // Pass control to the next middleware or route handler
  });
  
router.use("/auth", authRoute);
router.use("/story", storyRoute);
router.use("/user", userRoute);
router.use("/comment", commentRoute);

module.exports = router;
