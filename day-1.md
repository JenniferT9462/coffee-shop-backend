# Day One

##  Create new Express Project
- Initialize the project and install dependencies: 
   ```bash
   mkdir coffee-shop-backend
   cd coffee-shop-backend
   npm init -y
   npm install express mongoose dotenv
## Connect to MongoDB
- Set Up the Server Create an `index.js` file and use the following starter code:
    ```js
    const express = require('express');
    const mongoose = require('mongoose');
    const app = express();
    const port = 3000;

    // Middleware to parse JSON bodies
    app.use(express.json());

    // Connect to MongoDB
    mongoose
    .connect(atlasUri)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
- To connect your MongoDB database, put your `connection-string` in a `.env` file and then import it to `index.js`:
    ```js
    //Import dotenv
    require('dotenv').config();
    //Use environment variable
    const atlasUri = process.env.ATLAS_URI;
- NOTE: Make sure you installed `dotenv`.
## Define the Product Schema
- Create a directory named `models`.
- Inside `models`, create a directory named `Product.js`.
- Define the Product schema with the following fields; `name`, `description`, `price`, `category`, `stock` and `imageUrl`.
- Example Product Schema:
    ```js
    //Define the product schema
    const productSchema = mongoose.Schema({
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        stock: { type: Number },
        imageUrl: { type: String }
    });
- Create the model:
    ```js
    //Create the product model
    const Product = mongoose.model('Product', productSchema);
- Export the Schema
    ```js
    //Export the product model
    module.exports = Product;
## Implement Routes
- Create a directory named `routes`.
- Inside `routes`, create a file named `products.js`.
- To use `router` you need to import from express:
    ```js
    const Router = require('express').Router;
    const router = Router();
- Import your model from `Product.js`:
    ```js
    //Import Product schema
    const Product = require('../models/Product');
- Create routes for CRUD operations.
- Available Routes:
    | Method | Endpoint | Description |
    | ------ | -------- | ----------- |
    | POST | /products | Create a new Product |
    | GET | /products | Get all products |
    | GET | /products/:id | Get a product by ID |
    | PUT | /products/:id | Update a product by ID |
    | DELETE | /products/:id | Delete a product by ID |
- Before implementation - Create stub routes to make sure the `router` is working for all routes:
    ```js
    router.get('/', (req, res) => {
        res.json({
            message: "Get all products",
        });
    });
- Example Implementation:
    ```js
    //Get all products
    router.get('/', async (req, res) => {
        try {
            const products = await Product.find();
            res.json(products)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
## Testing
- Create a New Product:
    * Method: POST
    * Endpoint: http://localhost:3000/products
    * Response: 
        ```json
        {
            "name": "Latte",
            "description": "Milk and espresso",
            "price": 5.5,
            "category": "coffee",
            "stock": null,
            "imageUrl": "",
            "_id": "67618a13b93dc222b513533c",
            "__v": 0
        }
    * Screenshot:
    ![post](</img/post.png>)
- Get all Products:
    * Method: GET
    * Endpoint: http://localhost:3000/products
    * Response:
        ```json
        {
            "_id": "6760ed67ca6da1c127892021",
            "name": "Large Coffee Mug",
            "description": "A large coffee mug, perfect for your morning coffee.",
            "price": 14.99,
            "category": "mugs",
            "stock": 50,
            "imageUrl": "http://example.com/mug.jpg",
            "__v": 0
        },
            {
            "_id": "67618a13b93dc222b513533c",
            "name": "Latte",
            "description": "Milk and espresso",
            "price": 5.5,
            "category": "coffee",
            "stock": null,
            "imageUrl": "",
            "__v": 0
        }
    * Screenshot:
    ![get all products](</img/getAll.png>)
- Get a Single Product by ID:
    * Method: GET
    * Endpoint: http://localhost:3000/products/67618a13b93dc222b513533c
    * Response:
        ```json
        {
            "_id": "67618a13b93dc222b513533c",
            "name": "Latte",
            "description": "Milk and esspresso",
            "price": 5.5,
            "category": "coffee",
            "stock": null,
            "imageUrl": "",
            "__v": 0
        }
    * Screenshot:
    ![get single product](</img/getSingle.png>)
- Update a Product by ID:
    * Method: PUT
    * Endpoint: http://localhost:3000/products/67618a13b93dc222b513533c
    * Response: 
        ```json
        {
            "_id": "67618a13b93dc222b513533c",
            "name": "Everything Bagel",
            "description": "A fresh baked everything bagel.",
            "price": 3.99,
            "category": "pastry",
            "stock": 43,
            "imageUrl": "http://example.com/everythingBagel.jpg",
            "__v": 0
        }
    * Screenshot:
    ![update product](</img/update.png>)
- Delete a Product by ID:
    * Method: DELETE
    * Endpoint: http://localhost:3000/products/6760ed67ca6da1c127892021
    * Response:
        ```json
        {
            "_id": "6760ed67ca6da1c127892021",
            "name": "Large Coffee Mug",
            "description": "A large coffee mug, perfect for your morning coffee.",
            "price": 14.99,
            "category": "mugs",
            "stock": 50,
            "imageUrl": "http://example.com/mug.jpg",
            "__v": 0
        }
    * Screenshot:
    ![delete product](</img/delete.png>)
