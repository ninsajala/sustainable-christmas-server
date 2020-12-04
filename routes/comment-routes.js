const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ChristmasTip = require('../models/christmas-tip-model');
const Comment = require('../models/comment-model');
const User = require('../models/user-model');

router.post('/comment', (req, res, next) => {
  const { content } = req.body;
  const tip = req.body.ChristmasTipID;
  const author = req.user._id;

  Comment.create({
    content,
    author,
    tip,
  })
    .then((newComment) => {
      User.findByIdAndUpdate(author, {
        $push: { comments: newComment._id },
      });
    })
    .then((newComment) => {
      ChristmasTip.findByIdAndUpdate(tip, {
        $push: { comments: newComment._id },
      });
    })
    .then((newTip) => res.json(newTip))
    .catch((error) => res.json(error));
});

router.delete('/comment/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const { id } = req.params;

  Comment.findOneAndRemove(id)
    .then(() => {
      res.json({ message: 'Comment is successfully removed' });
    })
    .catch((error) => res.json(error));
});

module.exports = router;
