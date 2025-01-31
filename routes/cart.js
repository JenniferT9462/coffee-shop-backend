// Cart Routes
'use strict';

const express = require('express');
const Product = require("../models/Product"); // Import Product model
const Cart = require("../models/Cart");
const auth = require('../middleware/auth');
const router = express.Router();

// GET Cart for a User
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate("products.productId");
    console.log("Fetched Cart:", cart); // Debugging
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
});

// POST item to cart
router.post("/", auth, async (req, res) => {
  console.log("Authenticated User:", req.user); // Debugging user object
  try {
    console.log("Request received:", req.body); // Debugging
    console.log("User ID:", req.user.userId); // Debugging user ID

    if (!req.user.userId) {
      return res.status(401).json({ message: "Unauthorized - No User ID Found" });
    }

    const { productId, quantity = 1 } = req.body;

    // if (!productId || !name || !price) {
    //   return res.status(400).json({ message: "Missing required fields" });
    // }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      cart = new Cart({ userId: req.user.userId, products: [] });
    }

    const existingProduct = cart.products.find((p) => p.productId.toString() === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity || 1;
    } else {
      cart.products.push({
        productId,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity || 1,
      });
    }

    console.log("Cart before save:", cart);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
});

// UPDATE(PUT) Item Quantity
router.put("/:productId", auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const product = cart.products.find((p) => p.productId.toString() === req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.quantity = Math.max(quantity, 1);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating quantity", error });
  }
})

// DELETE Item form Cart
router.delete("/:productId", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter((p) => p.productId.toString() !== req.params.productId);
    await cart.save();

    res.json(cart);
  } catch (error) {
      res.status(500).json({ message: "Error removing item", error });
  }
});

// Clear Cart
router.delete("/", auth, async (req,res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.userId });
    res.json({ message: "Cart Cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
});

module.exports = router;

// const routerUnprotected = express.Router();
// const routerProtected = express.Router();
// const { getOrCreateCart, addProductToCart, removeProductFromCart } = require('../controllers/cartControllers');
// const mockAuth = require('../middleware/mockAuth');
// const role = require('../middleware/role');

// routerProtected.use(auth);
// routerProtected.use(role(['user', 'admin']));

// routerUnprotected.use(mockAuth);
// routerUnprotected.use(role(['user', 'admin']));

// for (let route of [routerProtected, routerUnprotected]) {
//   // router.get('/', getCarts);
//   route.get('/', getOrCreateCart); 
//   route.post('/', getOrCreateCart);
//   route.put('/:id', addProductToCart);
//   route.delete('/:id', removeProductFromCart);
// }

// module.exports = { cartRouterProtected: routerProtected, cartRouterUnprotected: routerUnprotected };