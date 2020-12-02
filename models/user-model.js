const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    firstName: String,
    lastName: String,
    favorites: [String],
    tips: [{ type: Schema.Types.ObjectId, ref: 'ChristmasTip' }],
    profilePictureUrl: {
      type: String,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    about: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model('User', userSchema);
