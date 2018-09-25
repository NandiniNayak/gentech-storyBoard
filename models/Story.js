const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StorySchema = new Schema({
  // input field
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  // dropdown
  status: {
    type: String,
    default: "Public"
  },
  // checkbox
  allowComments: {
    type: Boolean,
    default: true
  },
  // link stories to a user
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  storyDate: {
    type: Date,
    default: Date.now
  }
});

mongoose.model("stories", StorySchema);
