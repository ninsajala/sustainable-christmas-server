const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    firstName: String,
    lastName: String,
    about: String,
    picture: String,
    favorites: [{ type: Schema.Types.ObjectId, ref: 'ChristmasTip' }],
    tips: [{ type: Schema.Types.ObjectId, ref: 'ChristmasTip' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

module.exports = model('User', userSchema);
