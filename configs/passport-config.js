const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user-model.js');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);
  });
});

// Passport LocalStrategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, next) => {
      User.findOne({
        email,
      })
        .populate('tips')
        .populate('comments')
        .populate('favorites')
        .then((user) => {
          if (!user) {
            return next(null, false, {
              errorMessage: 'This email address was not recognized',
            });
          }

          if (!bcrypt.compareSync(password, user.passwordHash)) {
            return next(null, false, {
              errorMessage: 'Password is incorrect',
            });
          }

          next(null, user);
        })
        .catch((err) => next(err));
    }
  )
);

module.export = passport;
