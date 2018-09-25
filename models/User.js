const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// user schema

const UserSchema = new Schema({
  googleID: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

mongoose.model("users", UserSchema);
