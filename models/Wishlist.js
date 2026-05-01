const crypto = require('crypto');
const mongoose = require('mongoose');

const createShareToken = () => crypto.randomBytes(12).toString('hex');

const wishlistSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    eventDate: {
      type: Date
    },
    coverImage: {
      type: String,
      trim: true,
      default: ''
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    shareToken: {
      type: String,
      unique: true,
      default: createShareToken
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);

