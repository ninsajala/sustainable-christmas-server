const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const christmasTipSchema = new Schema(
  {
    title: { type: String, required: true },
    //author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    picture: String,
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    addedToFavorites: Number,
    category: {
      type: String,
      enumValues: ['Gifts', 'Food', 'Decoration', 'Charity', 'Other'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('ChristmasTip', christmasTipSchema);
