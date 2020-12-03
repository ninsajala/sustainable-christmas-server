const express = require('express');
const router = express.Router();

const uploader = require('../configs/cloudinary-config');


router.post('/upload', uploader.single('picture'), (req, res, next) => {

  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }

  res.json({ cloudUrl: req.file.path });
});



module.exports = router;