const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ChristmasTip = require('../models/christmas-tip-model');
const User = require('../models/user-model');

router.get('/user/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  const { id } = req.params.id;

  User.findOne(id)
    .populate('tips')
    .then((foundUser) => {
      res.status(200).json(foundUser);
    })
    .catch((error) => res.json(error));
});

router.put('/user/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const { firstName, lastName, about, picture } = req.body;
  const { id } = req.params;

  User.findOneAndUpdate(id, {
    firstName,
    lastName,
    about,
    picture,
  })
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((error) => res.json(error));
});

router.delete('/user/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  //TO DO: DELETE COMMENTS AND TIPS BY USER
  const { id } = req.params;

  User.findOneAndRemove(id)
    .then(() => {
      res.json({ message: 'Profile is successfully removed' });
    })
    .catch((error) => res.json(error));
});

module.exports = router;
