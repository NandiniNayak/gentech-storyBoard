// home page and dashboard routes
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Story = mongoose.model("stories");

// home route
router.get("/", (req, res) => {
  res.render("index/home");
});

// dashboard route
router.get("/dashboard", (req, res) => {
  // find the stories of the logged in user
  Story.find({
    user: req.user
  })
    .then(stories => {
      console.log(stories);
      res.render("index/dashboard", {
        stories: stories
      });
    })
    .catch(err => console.log(err));
});
module.exports = router;
