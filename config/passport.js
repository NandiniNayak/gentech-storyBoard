const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("./keys");
const mongoose = require("mongoose");
// create User model
const User = mongoose.model("users");

module.exports = passport => {
  // use a passport middlewae
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/auth/google/callback"
      },
      // google callback to fetch the tokens and profile info
      (acessToken, refreshToken, profile, done) => {
        console.log("accessToken", acessToken);
        console.log("refreshToken", refreshToken);
        console.log(("profile", profile));
        // save profile info coming from google to database
        console.log(profile.photos[0].value);
        const image = profile.photos[0].value.substring(
          0,
          profile.photos[0].value.indexOf("?")
        );
        console.log(image);
        const newUser = {
          googleID: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          // image: profile.photos[0].value
          image: image
        };
        // Ensure the user doesnot exist in the db already
        User.findOne({
          googleID: profile.id
        })
          .then(existingUser => {
            // if user exist in the db move on to the next passport function with saving this profile to db, else store the profile in the db and move on to the next function
            if (existingUser) {
              done(null, existingUser);
            } else {
              // create an entry in the db
              new User(newUser).save().then(user => {
                // pass user to the next function
                done(null, user);
                // control is given to serializeUser function
              });
            }
          })
          .catch(err => console.log(err));
      }
    )
  );
  // use serializeUser  to find the user id and set the cookie
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // fetch the user for the current session using the id
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => console.log(err));
  });
};
