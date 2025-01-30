// Cart Controllers
'use strict'
const Cart = require('../models/Cart');

async function getOrCreateCart(req, res, next) {
  const userId = req.user.userId;
  console.log("get or create Cart for" + userId);
  try {
    console.log("get or create Cart for" + userId);
    let cart = await Cart.findOne({ user: userId }).populate('products') ;
    if (!cart) {
      cart = new Cart({
        products: [],
        user: userId // associate the cart with the user
      });
      await cart.save();
    }
    req.cart = cart;
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function getCartById(req, res, next) {
  try {
    const cart = await Cart.findById(req.params.id).populate('products');
    if (!cart) {
      return res.status(404).json({ error: 'Cart Not Found!' });
    }
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

async function deleteCartById(req, res, next) {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) {
      return res.status(404).json({ error: 'Not Found!' });
    }
    res.status(204).json({ message: 'deleted' });
  } catch (error) {
    next(error);
  }
}

async function addProductToCart(req, res, next) {
  const productId = req.body.productId;
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ error: 'Cart Not Found!' });
    }
    cart.products.push(productId);
    await cart.save();
    await cart.populate('products');
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

async function removeProductFromCart(req, res, next) {
  const productId = req.body.productId;
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ error: 'Cart Not Found!' });
    }
    console.log(cart.products);
    // remove the product(s) from the cart
    // HINT: use filter and Mongoose's .equals() method to compare ObjectIds and userId strings
    cart.products = cart.products.filter(product => !product.equals(productId));
    await cart.save();
    await cart.populate('products');
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOrCreateCart,
  getCartById,
  deleteCartById,
  addProductToCart,
  removeProductFromCart,
};