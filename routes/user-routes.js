const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/user-model');
const ChristmasTip = require('../models/christmas-tip-model');

router.get('/user/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  const { id } = req.params;

  User.findById(id)
    .populate('tips')
    .populate('favorites')
    .populate('following')
    .then((foundUser) => {
      res.json(foundUser);
    })
    .catch((error) => res.json(error));
});

router.put('/favorites/add', (req, res, next) => {
  const { userId, tipId } = req.body;

  User.findByIdAndUpdate(
    userId,
    {
      $push: { favorites: tipId },
    },
    { new: true }
  )
    .populate('favorites')
    .populate('tips')
    .populate('following')
    .then((updatedUser) => {
      ChristmasTip.findByIdAndUpdate(
        tipId,
        {
          $push: { addedToFavorites: userId },
        },
        { new: true }
      ).then((updatedTip) => {
        res.send(updatedUser);
        console.log(updatedTip);
      });
    })
    .catch((error) => res.json(error));
});

router.put('/favorites/remove', (req, res, next) => {
  const { userId, tipId } = req.body;

  User.findByIdAndUpdate(
    userId,
    {
      $pull: { favorites: tipId },
    },
    { new: true }
  )
    .populate('favorites')
    .populate('tips')
    .populate('following')
    .then((updatedUser) => {
      ChristmasTip.findByIdAndUpdate(
        tipId,
        {
          $pull: { addedToFavorites: userId },
        },
        { new: true }
      ).then((updatedTip) => {
        res.send(updatedUser);
        console.log(updatedTip);
      });
    })
    .catch((error) => res.json(error));
});

router.put('/user/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const { firstName, lastName, about, picture, pictureOld } = req.body;
  const { id } = req.params;

  let newPicture;
  if (!picture) {
    newPicture = pictureOld;
  } else {
    newPicture = picture;
  }

  User.findByIdAndUpdate(
    id,
    {
      firstName,
      lastName,
      about,
      picture: newPicture,
    },
    { new: true }
  )
    .populate('favorites')
    .populate('tips')
    .populate('following')
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

  User.findByIdAndRemove(id)
    .then(() => {
      res.json({ message: 'Profile is successfully removed' });
    })
    .catch((error) => res.json(error));
});

router.put('/follow', (req, res, next) => {
  const { myID, otherUserId } = req.body;

  User.findByIdAndUpdate(
    myID,
    {
      $push: { following: otherUserId },
    },
    { new: true }
  )
    .populate('favorites')
    .populate('tips')
    .populate('following')
    .then((updatedUser1) => {
      User.findByIdAndUpdate(
        otherUserId,
        {
          $push: { followers: myID },
        },
        { new: true }
      )
        .populate('favorites')
        .populate('tips')
        .populate('following')
        .then((updatedUser2) => {
          res.send({ updatedUser1, updatedUser2 });
        });
    })
    .catch((error) => res.json(error));
});

router.put('/unfollow', (req, res, next) => {
  const { myID, otherUserId } = req.body;

  User.findByIdAndUpdate(
    myID,
    {
      $pull: { following: otherUserId },
    },
    { new: true }
  )
    .populate('favorites')
    .populate('tips')
    .populate('following')
    .then((updatedUser1) => {
      User.findByIdAndUpdate(
        otherUserId,
        {
          $pull: { followers: myID },
        },
        { new: true }
      )
        .populate('favorites')
        .populate('tips')
        .populate('following')
        .then((updatedUser2) => {
          res.send({ updatedUser1, updatedUser2 });
        });
    })
    .catch((error) => res.json(error));
});

module.exports = router;
