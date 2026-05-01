const express = require('express');
const {
  getWishlists,
  createWishlist,
  getWishlistById,
  updateWishlist,
  deleteWishlist,
  getPublicWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/public/:shareToken', getPublicWishlist);
router.route('/').get(protect, getWishlists).post(protect, createWishlist);
router
  .route('/:id')
  .get(protect, getWishlistById)
  .put(protect, updateWishlist)
  .delete(protect, deleteWishlist);

module.exports = router;

