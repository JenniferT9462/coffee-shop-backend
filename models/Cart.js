

// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({
//   products: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product',
//     },
//   ],
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//   },
// }, { timestamps: true, });

// const Cart = mongoose.model('Cart', cartSchema);

// module.exports = Cart;


// models/Cart.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
