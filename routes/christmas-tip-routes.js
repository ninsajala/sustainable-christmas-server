const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ChristmasTip = require('../models/christmas-tip-model')
const Comment = require('../models/comment-model')
const User = require('../models/user-model')



router.post('/tips', (req, res, next) => {
const {title, content, picture} = req.body,

const author = req.user._id

  ChristmasTip.create({
    title,
    content,
    picture,
    author,
    comments: [],
    addedToFavorites: 0
  })
  .then((newTip) =>
  {res.json(newTip)})
  .catch((error) => next(error));
})

router.get('/tips', (req, res, next) => {

ChristmasTip.find()
  .populate('author')
  .then((allTips) => {
  res.json(allTips)
    })
  .catch((error) => next(error));
})

router.get('/tips/:id', (req, res, next) => {
  const { id } = req.params.id

ChristmasTip.findOne(id)
  .populate('author')
  .populate('comments')
  .then((foundTip) => {
    res.json(foundTip)
  })
  .catch((error) => next(error));

})

router.put('/tips/:id', (req,res, next) => {
ChristmasTip.findOneAndUpdate()
})

router.delete('/tips/:id', (req,res, next) => {
ChristmasTip.findOneAndRemove()
})


module.exports = router;