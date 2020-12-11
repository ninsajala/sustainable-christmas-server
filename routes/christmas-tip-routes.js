const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ChristmasTip = require('../models/christmas-tip-model');
const User = require('../models/user-model');

router.post('/tips', (req, res, next) => {
  const { title, content, picture, category, author, extraInfo } = req.body;
  let tipId;

  let sendPicture;

  if (!picture) {
    sendPicture = `https://res.cloudinary.com/ddudasjs9/image/upload/v1607674804/photo-1480442646297-37901d5ea815_ofczba.jpg`;
  } else {
    sendPicture = picture;
  }

  ChristmasTip.create({
    title,
    content,
    picture: sendPicture,
    category,
    author,
    extraInfo,
    comments: [],
    addedToFavorites: [],
  })
    .then((newTip) => {
      User.findByIdAndUpdate(
        author,
        {
          $push: { tips: tipId },
        },
        { new: true }
          .populate('favorites')
          .populate('tips')
          .populate('following')
      ).then((updatedUser) => {
        ChristmasTip.findById(newTip._id)
          .populate('author')
          .populate('comments')
          .populate({
            path: 'comments',
            populate: {
              path: 'author',
              model: 'User',
            },
          })
          .then((foundTip) => {
            res.send({ foundTip, updatedUser });
          });
      });
    })
    .catch((error) => res.json(error));
});

router.get('/tips', (req, res, next) => {
  ChristmasTip.find()
    .populate('author')
    .then((allTips) => {
      res.json(allTips);
    })
    .catch((error) => res.json(error));
});

router.get('/tips/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  const { id } = req.params;

  ChristmasTip.findById(id)
    .populate('author')
    .populate('comments')
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
        model: 'User',
      },
    })
    .then((foundTip) => {
      res.json(foundTip);
    })
    .catch((error) => res.json(error));
});

router.put('/tips/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const { title, content, picture, pictureOld, category, extraInfo } = req.body;
  const { id } = req.params;

  let newPicture;
  if (!picture) {
    newPicture = pictureOld;
  } else {
    newPicture = picture;
  }

  ChristmasTip.findByIdAndUpdate(
    id,
    {
      title,
      content,
      picture: newPicture,
      category,
      extraInfo,
    },
    { new: true }
  )
    .populate('author')
    .populate('comments')
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
        model: 'User',
      },
    })
    .then((updatedTip) => {
      res.status(200).json(updatedTip);
    })
    .catch((error) => res.json(error));
});

router.delete('/tips/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const { id } = req.params;

  ChristmasTip.findByIdAndRemove(id)
    .then(() => {
      res.json({ message: 'Tip is successfully removed' });
    })
    .catch((error) => res.json(error));
});

module.exports = router;
