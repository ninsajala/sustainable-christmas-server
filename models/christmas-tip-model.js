const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const christmasTipSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    picture: {
      type: String,
      default: `https://res.cloudinary.com/ddudasjs9/image/upload/v1607674804/photo-1480442646297-37901d5ea815_ofczba.jpg`,
    },
    extraInfo: String,
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    addedToFavorites: [],
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
