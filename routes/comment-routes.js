const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ChristmasTip = require('../models/christmas-tip-model');
const Comment = require('../models/comment-model');
const User = require('../models/user-model');

router.post('/comment', (req, res, next) => {
  Comment.create();
});

router.get('/comment', (req, res, next) => {
  Comment.find();
});

router.put('/comment/:id', (req, res, next) => {
  Comment.findOneAndUpdate();
});

router.delete('/comment/:id', (req, res, next) => {
  Comment.findOneAndRemove();
});

module.exports = router;
