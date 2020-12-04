const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ChristmasTip = require('../models/christmas-tip-model');
const User = require('../models/user-model');

router.post('/tips', (req, res, next) => {
  const { title, content, picture, category, author } = req.body;
  let tipId;
  ChristmasTip.create({
    title,
    content,
    picture,
    category,
    author,
    comments: [],
    addedToFavorites: [],
  })
    .then((newTip) => {
      tipId = newTip._id;
    })
    .then(() => {
      User.findByIdAndUpdate(author, {
        $push: { tips: tipId },
      });
    })
    .then(() => Tips.findById(tipId).then((foundTip) => res.json(foundTip)))
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

  const { title, content, picture, category } = req.body;
  const { id } = req.params;

  ChristmasTip.findByIdAndUpdate(
    id,
    {
      title,
      content,
      picture,
      category,
    },
    { new: true }
  )
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

  ChristmasTip.findByIdAndRemove(id)
    .then(() => {
      res.json({ message: 'Tip is successfully removed' });
    })
    .catch((error) => res.json(error));
});

module.exports = router;
