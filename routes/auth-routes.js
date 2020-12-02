const express = require('express');
const router = express.Router();

const passport = require('passport');
const bcrypt = require('bcryptjs');

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
    const xc = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      passwordHash: passwordHash,
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

module.exports = router;
