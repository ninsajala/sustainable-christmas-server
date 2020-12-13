const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ChristmasTip = require('../models/christmas-tip-model');
const Comment = require('../models/comment-model');
const User = require('../models/user-model');

router.post('/comment', (req, res, next) => {
  const { content, tip, author } = req.body;
  let commentID;

  Comment.create({
    content,
    author,
    tip,
  })
    .then((newComment) => {
      commentID = newComment._id;
    })
    .then(() =>
      ChristmasTip.findByIdAndUpdate(
        tip,
        {
          $push: { comments: commentID },
        },
        { new: true }
      )
    )
    .then(() =>
      User.findByIdAndUpdate(
        author,
        {
          $push: { comments: commentID },
        },
        { new: true }
      )
        .populate('tips')
        .populate('favorites')
        .populate('following')
        .then((foundUser) => res.send(foundUser))
    )

    .catch((error) => res.json(error));
});

router.delete('/comment/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  const { id } = req.params;

  Comment.findByIdAndRemove(id)
    .then(() => {
      res.json({ message: 'Comment is successfully removed' });
    })
    .catch((error) => res.json(error));
});

module.exports = router;
