// const express = require('express');
// const router = express.Router();
// const {
//   getOrCreateCart,
//   addProductToCart,
//   removeProductFromCart,
// } = require('../controllers/cartControllers');

// // Routes for the cart
// router.post('/', getOrCreateCart);
// router.put('/:id', addProductToCart);
// router.delete('/:id', removeProductFromCart);

// module.exports = router;

// routes/cart.js
const express = require("express");
const Cart = require("../models/Cart");

const router = express.Router();

// Get cart for a user
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving cart", error });
  }
});

// Add or update an item in the cart
router.post("/:userId", async (req, res) => {
  const { productId, name, price, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error });
  }
});

// Remove an item from the cart
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (cart) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== req.params.productId
      );
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
});

// Clear the cart
router.delete("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (cart) {
      cart.items = [];
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
});

module.exports = router;
