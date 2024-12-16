const Router = require('express').Router;
const router = Router();

//Get all products
router.get('/', (req, res) => {
    res.json({
        message: "Get all products",
    });
});

module.exports = router;