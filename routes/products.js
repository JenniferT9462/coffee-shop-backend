const Router = require("express").Router;
const router = Router();

//Import Product schema
const Product = require("../models/Product");
// Import upload middleware
const upload = require("../middleware/upload");
// Import role middleware
const role = require('../middleware/role');

//Get all products
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      sortBy,
      sortOrder = "asc",
    } = req.query;
    const filter = category ? { category } : {};
    const sort = sortBy ? { [sortBy]: sortOrder === "asc" ? 1 : -1 } : {};
    const products = await Product.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((page - 1) * limit);
    const total = await Product.countDocuments(filter);
    res.json({ total, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  // res.json({
  //     message: "Get all products",
  // });
});

// POST Create a new product
router.post("/", role('admin'), upload, async (req, res) => {
  try {
    //Extract the request body containing the product data
    const { name, description, price, category, stock } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
    // Create a new Product instance w/provided data
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
    });
    // Save the product data to the database
    const savedProduct = await product.save();
    console.log(savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save product." });
  }
  // res.json({
  //     message: "New product saved."
  // });
});

// GET a single product by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT Update a product by ID
router.put("/:id", upload, async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price, category, stock } = req.body;
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, category, stock, imageUrl },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a product by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
