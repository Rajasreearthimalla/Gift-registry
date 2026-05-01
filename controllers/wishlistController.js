const mongoose = require('mongoose');
const Item = require('../models/Item');
const Wishlist = require('../models/Wishlist');
const asyncHandler = require('../utils/asyncHandler');

const getWishlists = asyncHandler(async (req, res) => {
  const wishlists = await Wishlist.find({ owner: req.user._id })
    .sort({ updatedAt: -1 })
    .lean();

  const wishlistIds = wishlists.map((wishlist) => wishlist._id);

  const itemStats = wishlistIds.length
    ? await Item.aggregate([
        {
          $match: {
            wishlist: { $in: wishlistIds.map((id) => new mongoose.Types.ObjectId(id)) }
          }
        },
        {
          $group: {
            _id: '$wishlist',
            totalItems: { $sum: 1 },
            reservedItems: {
              $sum: {
                $cond: [{ $eq: ['$isReserved', true] }, 1, 0]
              }
            },
            purchasedItems: {
              $sum: {
                $cond: [{ $eq: ['$isPurchased', true] }, 1, 0]
              }
            }
          }
        }
      ])
    : [];

  const statsMap = itemStats.reduce((accumulator, stat) => {
    accumulator[stat._id.toString()] = stat;
    return accumulator;
  }, {});

  const enrichedWishlists = wishlists.map((wishlist) => {
    const stats = statsMap[wishlist._id.toString()];
    return {
      ...wishlist,
      totalItems: stats?.totalItems || 0,
      reservedItems: stats?.reservedItems || 0,
      purchasedItems: stats?.purchasedItems || 0
    };
  });

  res.json({ wishlists: enrichedWishlists });
});

const createWishlist = asyncHandler(async (req, res) => {
  const { title, description, eventDate, coverImage, isPublic } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Wishlist title is required');
  }

  const wishlist = await Wishlist.create({
    owner: req.user._id,
    title,
    description,
    eventDate,
    coverImage,
    isPublic
  });

  res.status(201).json({
    message: 'Wishlist created successfully',
    wishlist
  });
});

const getWishlistById = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({
    _id: req.params.id,
    owner: req.user._id
  }).lean();

  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  const items = await Item.find({ wishlist: wishlist._id }).sort({
    isPurchased: 1,
    createdAt: -1
  });

  res.json({ wishlist, items });
});

const updateWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({
    _id: req.params.id,
    owner: req.user._id
  });

  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  const { title, description, eventDate, coverImage, isPublic } = req.body;

  if (typeof title === 'string' && title.trim()) {
    wishlist.title = title.trim();
  }

  if (typeof description === 'string') {
    wishlist.description = description;
  }

  if (typeof eventDate !== 'undefined') {
    wishlist.eventDate = eventDate || null;
  }

  if (typeof coverImage === 'string') {
    wishlist.coverImage = coverImage;
  }

  if (typeof isPublic === 'boolean') {
    wishlist.isPublic = isPublic;
  }

  await wishlist.save();

  res.json({
    message: 'Wishlist updated successfully',
    wishlist
  });
});

const deleteWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({
    _id: req.params.id,
    owner: req.user._id
  });

  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  await Item.deleteMany({ wishlist: wishlist._id });
  await wishlist.deleteOne();

  res.json({ message: 'Wishlist deleted successfully' });
});

const getPublicWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({
    shareToken: req.params.shareToken,
    isPublic: true
  })
    .populate('owner', 'name')
    .lean();

  if (!wishlist) {
    res.status(404);
    throw new Error('Shared wishlist not found');
  }

  const items = await Item.find({ wishlist: wishlist._id }).sort({
    isPurchased: 1,
    createdAt: -1
  });

  res.json({
    wishlist: {
      ...wishlist,
      ownerName: wishlist.owner?.name || 'Anonymous'
    },
    items
  });
});

module.exports = {
  getWishlists,
  createWishlist,
  getWishlistById,
  updateWishlist,
  deleteWishlist,
  getPublicWishlist
};

