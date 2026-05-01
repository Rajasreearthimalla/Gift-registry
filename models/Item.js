const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    wishlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wishlist',
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      default: 0,
      min: 0
    },
    image: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    link: {
      type: String,
      trim: true,
      default: ''
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    isReserved: {
      type: Boolean,
      default: false
    },
    reservedByName: {
      type: String,
      trim: true,
      default: ''
    },
    reservedByEmail: {
      type: String,
      trim: true,
      default: ''
    },
    reservedAt: {
      type: Date,
      default: null
    },
    isPurchased: {
      type: Boolean,
      default: false
    },
    purchasedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Item', itemSchema);

