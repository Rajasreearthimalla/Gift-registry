const Item = require('../models/Item');
const Wishlist = require('../models/Wishlist');
const asyncHandler = require('../utils/asyncHandler');

const createItem = asyncHandler(async (req, res) => {
  const {
    wishlistId,
    name,
    price,
    image,
    description,
    link,
    priority
  } = req.body;

  if (!wishlistId || !name) {
    res.status(400);
    throw new Error('Wishlist and item name are required');
  }

  const wishlist = await Wishlist.findOne({
    _id: wishlistId,
    owner: req.user._id
  });

  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  const item = await Item.create({
    wishlist: wishlistId,
    owner: req.user._id,
    name,
    price,
    image,
    description,
    link,
    priority
  });

  res.status(201).json({
    message: 'Item added successfully',
    item
  });
});

const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  if (item.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You do not have permission to update this item');
  }

  const {
    name,
    price,
    image,
    description,
    link,
    priority,
    isReserved,
    isPurchased,
    reservedByName,
    reservedByEmail
  } = req.body;

  if (typeof name === 'string' && name.trim()) {
    item.name = name.trim();
  }

  if (typeof price !== 'undefined') {
    item.price = Number(price) || 0;
  }

  if (typeof image === 'string') {
    item.image = image;
  }

  if (typeof description === 'string') {
    item.description = description;
  }

  if (typeof link === 'string') {
    item.link = link;
  }

  if (typeof priority === 'string') {
    item.priority = priority;
  }

  if (typeof isPurchased === 'boolean') {
    item.isPurchased = isPurchased;
    item.purchasedAt = isPurchased ? new Date() : null;

    if (isPurchased) {
      item.isReserved = false;
      item.reservedByName = '';
      item.reservedByEmail = '';
      item.reservedAt = null;
    }
  }

  if (typeof isReserved === 'boolean' && !item.isPurchased) {
    item.isReserved = isReserved;
    item.reservedByName = isReserved ? reservedByName || item.reservedByName : '';
    item.reservedByEmail = isReserved ? reservedByEmail || item.reservedByEmail : '';
    item.reservedAt = isReserved ? item.reservedAt || new Date() : null;
  }

  await item.save();

  res.json({
    message: 'Item updated successfully',
    item
  });
});

const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  if (item.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You do not have permission to delete this item');
  }

  await item.deleteOne();

  res.json({ message: 'Item deleted successfully' });
});

const reserveItem = asyncHandler(async (req, res) => {
  const { reservedByName, reservedByEmail } = req.body;

  if (!reservedByName) {
    res.status(400);
    throw new Error('Your name is required to reserve a gift');
  }

  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  const wishlist = await Wishlist.findById(item.wishlist);

  if (!wishlist || !wishlist.isPublic) {
    res.status(403);
    throw new Error('This item cannot be reserved from a private wishlist');
  }

  if (item.isPurchased) {
    res.status(409);
    throw new Error('This gift has already been purchased');
  }

  if (item.isReserved) {
    res.status(409);
    throw new Error('This gift is already reserved');
  }

  item.isReserved = true;
  item.reservedByName = reservedByName;
  item.reservedByEmail = reservedByEmail || '';
  item.reservedAt = new Date();

  await item.save();

  res.json({
    message: 'Gift reserved successfully',
    item
  });
});

module.exports = {
  createItem,
  updateItem,
  deleteItem,
  reserveItem
};

