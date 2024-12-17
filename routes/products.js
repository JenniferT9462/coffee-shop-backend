const Router = require('express').Router;
const router = Router();

//Import Product schema
const Product = require('../models/Product');

//Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    // res.json({
    //     message: "Get all products",
    // });
});

// POST Create a new product
router.post('/', async (req, res) => {
    //Extract the request body containing the product data
    const data = req.body;
    // Create a new Product instance w/provided data
    const product = new Product({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        imageUrl: data.imageUrl
    });
    try {
        // Save the product data to the database
        const savedProduct = await product.save();
        console.log(savedProduct);
        res.json(savedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to save product." });
    }
    // res.json({
    //     message: "New product saved."
    // });
});

// GET a single product by ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    res.json({
        message: "Single Product",
        productId: id
       
    });
});

// PUT Update a product by ID
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    res.json({
        message: `Updated ${id} Product Successful.`
    });
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    res.json({
        message: `Deleted ${id} Product Successful.`
    });
});

module.exports = router;