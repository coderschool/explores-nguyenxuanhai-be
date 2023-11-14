var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/api/auth/login/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(accessToken, refreshToken, "tokens");

      console.log(profile, "profile");
      // Check if google profile exists
      if (profile.id) {
        const existingUser = await User.findOne({
          //   googleId: profile.id,
          email: profile.emails[0].value,
        });

        if (existingUser) {
          await done(null, existingUser);
        } else {
          const user = await User.create({
            // googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.name.familyName + " " + profile.name.givenName,
            role: "manager",
            isVerified: "true",
          });
          await done(null, user);
        }
      }
    }
  )
);

module.exports = passport;
