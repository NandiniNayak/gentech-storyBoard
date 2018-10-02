const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Story = mongoose.model("stories");

router.get("/new", (req, res) => {
  res.render("stories/new");
});

// Stories Index
router.get("/", (req, res) => {
  // fetch public stories
  Story.find({ status: "public" })
    // populate suer with user fields : access association
    .populate("user")
    .sort({ date: "desc" })
    .then(stories => {
      console.log(stories);
      // res.send('STORIES');
      res.render("stories/index", {
        stories: stories
      });
    });
});

// route for the show page
router.get("/show/:id", (req, res) => {
  // find the story from the database that matched the id
  Story.findOne({
    _id: req.params.id
  })
    // bring in user info from collection to access image, firstname and lastName
    .populate("user")
    .populate("comments.commentUser")
    .then(story => {
      console.log(story);
      res
        .render("stories/show", {
          story: story
        })
        .catch(err => console.log(err));
    });
});

// edit story form
router.get("/edit/:id", (req, res) => {
  console.log("edit story");
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    // if the story doesnot belong to user disable edit
    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      // res.send('STORIES');
      res.render("stories/edit", {
        story: story
      });
    }
  });
});

// edit story put
// EDIT form process
router.put("/:id", (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    let allowComments;

    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    //New values
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;
    story.save().then(story => {
      res.redirect("/dashboard");
    });
  });
});
router.post("/", (req, res) => {
  console.log(req.body);
  // fetch the data save to the story database and redirect to stories/index
  let allowComments;
  if (req.allowComments == "on") {
    allowComments = true;
  } else {
    allowComments = false;
  }
  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  };
  new Story(newStory)
    .save()
    .then(story => res.redirect("/stories"))
    .catch(err => console.log(err));
});
// post route for comments
router.post("/comment/:id", (req, res) => {
  // find a particular story by id
  Story.findOne({
    _id: req.params.id
  })
    .then(story => {
      // check if the comment was from same user who posted the story
      console.log(`story user id is ${story.user.id}`);
      console.log(`logged in user id is ${req.user.id}`);
      if (story.user.id === req.user.id) {
        // redirect back to stories show page without adding comment to db
        res.redirect(`/stories/show/${story.id}`);
      } else {
        // create a newComment object and save to db
        const newComment = {
          commentBody: req.body.commentBody,
          commentUser: req.user.id
        };
        // add newComment to the story.comment array
        // unshift the comment to get the latest comment first
        story.comments.unshift(newComment);
        // save the story comment to db
        story.save().then(story => {
          res.redirect(`/stories/show/${story.id}`);
        });
      }
    })
    .catch(err => console.log(err));
});

module.exports = router;
