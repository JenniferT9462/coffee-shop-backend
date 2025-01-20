const express = require('express');
const router = express.Router();
const {
  getOrCreateCart,
  addProductToCart,
  removeProductFromCart,
} = require('../controllers/cartControllers');

// Routes for the cart
router.post('/', getOrCreateCart);
router.put('/:id', addProductToCart);
router.delete('/:id', removeProductFromCart);

module.exports = router;
