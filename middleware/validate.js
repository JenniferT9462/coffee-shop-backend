// Import Joi
const Joi = require('joi');

const validateProduct = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().required(),
        stock: Joi.number().required(),
        imageUrl: Joi.string().uri(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

// Export validate middleware
module.exports = { validateProduct };