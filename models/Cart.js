
const { required } = require('joi');
const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    }
  ]
})

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

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;



