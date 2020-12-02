const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ChristmasTip = require('../models/christmas-tip-model');
const User = require('../models/user-model');

router.post('/tips', (req, res, next) => {
  const { title, content, picture, category } = req.body;
  const author = req.user._id;

  ChristmasTip.create({
    title,
    content,
    picture,
    category,
    author,
    comments: [],
    addedToFavorites: 0,
  })
    .then((newTip) => {
      User.findByIdAndUpdate(author, {
        $push: { tips: newTip._id },
      });
    })
    .then((newTip) => res.json(newTip))
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
  const { id } = req.params.id;

  ChristmasTip.findOne(id)
    .populate('author')
    .populate('comments')
    .then((foundTip) => {
      res.status(200).json(foundTip);
    })
    .catch((error) => res.json(error));
});

router.put('/tips/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const { title, content, picture, category } = req.body;
  const { id } = req.params;

  ChristmasTip.findOneAndUpdate(id, {
    title,
    content,
    picture,
    category,
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
  //TO DO: DELETE FROM USER ARRAY AND DELETE COMMENTS FROM DB
  const { id } = req.params;

  ChristmasTip.findOneAndRemove(id)
    .then(() => {
      res.json({ message: 'Tip is successfully removed' });
    })
    .catch((error) => res.json(error));
});

module.exports = router;
