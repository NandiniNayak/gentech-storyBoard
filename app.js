const express = require("express");
const exphbs = require("express-handlebars");
const passport = require("passport");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const keys = require("./config/keys");
const bodyParser = require("body-parser");
// path for css
const path = require("path");

const PORT = 3000;

// Set Static folder
app.use(express.static(path.join(__dirname, "public")));

// require model
require("./models/User");
require("./models/Story");

// require routes
const index = require("./routes/index");
const stories = require("./routes/story");
// connect to mongodb
mongoose
  .connect(
    keys.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("connected to local development db"))
  .catch(err => console.log(err));
// load passport middleware
require("./config/passport")(passport);
// load routes
const auth = require("./routes/auth");
// express handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// middleware for body bodyParser
// parse various different custom JSON types as JSON

// / parse various different custom JSON types as JSON
// Body parser middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "secure",
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

// set global variable user
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// use the auth routes
app.use("/auth", auth);
app.use("/", index);
app.use("/stories", stories);

app.get("/timestamp-cached", (request, response) => {
  response.set("Cache-Control", "public, max-age=300, s-maxage=600");
  response.send(`This is cached! Time is: ${Date.now()}`);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
