const express = require('express');
const {
  createItem,
  updateItem,
  deleteItem,
  reserveItem
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createItem);
router.post('/:id/reserve', reserveItem);
router.route('/:id').put(protect, updateItem).delete(protect, deleteItem);

module.exports = router;

