const Router = require('express').Router;
const router = Router();

//Get all products
router.get('/', async (req, res) => {
    res.json({
        message: "Get all products",
    });
});

// POST Create a new product
router.post('/', async (req, res) => {
    res.json({
        message: "New product saved."
    });
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