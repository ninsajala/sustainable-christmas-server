const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    content: { type: String, required: true},
    tip: { type: Schema.Types.ObjectId, ref: 'ChristmasTip' },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    about: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model('Comment', commentSchema);
