const express = require('express');
const router = express.Router();

const passport = require('passport');
const bcrypt = require('bcrypt');

const User = require('../models/user-model');

router.post('/signup', (req, res, next) => {
  const { email, password, passwordCheck, firstName, lastName } = req.body;

  if (!email || !password || !passwordCheck) {
    res.status(400).json({ message: 'Email and password are mandatory' });
    return;
  }

  const emailRegex = /^\S+@\S+\.\S+$/;

  if (!emailRegex.test(email)) {
    res.status(400).json({
      message: 'Please fill in a valid email address',
    });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        'Password should be a least 8 characters and contain a number, small letter and capital',
    });
    return;
  }

  if (password !== passwordCheck) {
    res.status(400).json({
      message: `Passwords don't match`,
    });
    return;
  }

  User.findOne({ email }, (err, foundUser) => {
    if (err) {
      res
        .status(500)
        .json({ message: 'Something went wrong when looking for the user' });
      return;
    }

    if (foundUser) {
      res.status(400).json({
        message:
          'This email address has already been registered. Use a different one or log in',
      });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      about: '',
      picture:
        'https://res.cloudinary.com/ddudasjs9/image/upload/v1607536663/sustainable-christmas/file_g8qeps.png',
      favorites: [],
      tips: [],
      comments: [],
      following: [],
      followers: [],
    });

    newUser.save((err) => {
      if (err) {
        res
          .status(400)
          .json({ message: 'Saving user to database went wrong.' });
        return;
      }

      req.login(newUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Login after signup went bad.' });
          return;
        }

        res.status(200).json(newUser);
      });
    });
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res
        .status(500)
        .json({ message: 'Something went wrong authenticating user' });
      return;
    }

    if (!theUser) {
      res
        .status(401)
        .json({ message: 'Something went wrong authenticating user' });
      return;
    }

    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Session could not be saved' });
        return;
      }

      res.status(200).json(theUser);
    });
  })(req, res, next);
});

router.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});

module.exports = router;
