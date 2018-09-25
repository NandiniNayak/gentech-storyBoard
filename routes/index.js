// home page and dashboard routes
const express = require("express");
const router = express.Router();

// home route
router.get("/", (req, res) => {
  res.render("index/home");
});

// dashboard route
router.get("/dashboard", (req, res) => {
  res.render("index/dashboard");
});
module.exports = router;
