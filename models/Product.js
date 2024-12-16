//Import mongoose
const mongoose = require('mongoose');

//Define the product schema
const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    imageUrl: { type: String, required: true }
});

//Create the product model
const Product = mongoose.model('Product', productSchema);

//Export the product model
module.exports = Product;