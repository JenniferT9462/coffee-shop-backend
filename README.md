# coffee-shop-backend
## Part One
- Set up a new Express project.
- Connect to MongoDB using Mongoose.
- Define a Product Schema.
- Implement and test CRUD operations for products.
### File Structure
![file structure](</img/fileStructure.png>)
### Initialize Project
- Create new Express Project
   ```bash
   mkdir coffee-shop-backend
   cd coffee-shop-backend
   npm init -y
   npm install express mongoose dotenv
### Connect to MongoDB
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
### Define the Product Schema
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
### Implement Routes
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
## Part Two
- Set up user authentication with JWT.
- Create user registration and login endpoints.
- Protect routes with authentication middleware.
### Install Dependencies
- Install `bcrypt` for password hashing and `jsonwebtoken` for authorization. 
    ```bash
    npm install bcryptjs jsonwebtoken
### Create the User Model
- Inside `models` directory, create a file named `User.js`.
- Import `bcrypt`:
    ```js
    const bcrypt = require('bcryptjs');
- Define the user schema with the following fields; `name`, `email`, `password` and `role`.
- Example User Schema:
    ```js
    const userSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true, unique: true },
        role: { type: String, default: 'user', enum: [ 'admin', 'user' ]}
    });
- Hash the password before saving the user using `bcrypt`.
    ```js
    //Hash bcrypt
    userSchema.pre('save', async function (next) {
        const salt = await bcrypt.genSalt(10);
        const plainTextPassword = this.password;
        const encryptedPassword = await bcrypt.hash(plainTextPassword, salt);
        this.password = encryptedPassword;
        next();
    })
- Create method to compare passwords:
    ```js
    //Method to compare passwords
    userSchema.methods.comparePassword = function (inputPassword) {
        return bcrypt.compare(inputPassword, this.password);
    }
- Create User Model:
    ```js
    const User = mongoose.model('User', userSchema);
- Export the model:
    ```js
    module.exports = User;
### Implement Registration and Login Routes
- Inside `routes` directory, create a file named `auth.js`.
- Import JWT and User Model:
    ```js
    const User = require('../models/User');
    const jwt = require('jsonwebtoken');
- Import `express` and use `Router`:
    ```js
    const express = require('express');
    const router = express.Router();
- In `index.js` use auth routes:
    ```js
    app.use('/auth', authRoutes);
- In `auth.js` inside the `routes` directory, create stub routes to make sure that router is working:
- Example stub route for `/register`: 
    ```js
    router.post('/register',  (req, res) => {
        res.json({ message: "User saved." });
    });
- Example stub route for `/login`:
    ```js
    router.post('/login',  (req, res) => {
        res.json({ message: "User now logged in." });
    });
- Test in postman to make sure the new routes work.
- Implement `/register` and `/login`.
- Export `router`:
    ```js
    module.exports = router;
## Create Authentication Middleware
- Create a directory named `middleware`.
- Inside `middleware` create a file named `auth.js`.
- Import `jsonwebtoken`:
    ```js
    const jwt = require('jsonwebtoken');
- Generate a `secretKey` and add that to your `.env` file. 
- NOTE: you can generate a `secretKey` right in the terminal using `Node`:
    ```bash
    node -e "console.log(require('crypto').randomBytes(256).toString('hex'))"
- Copy the logged key and paste in the `env`. 
- Use your `secretKey` for `jwt`:
    ```js
    //Use jwt secret key
    const secretKey = process.env.JWT_SECRET;
- Create the middleware:
    ```js
    const auth = ((req, res, next) => {
        // Retrieve the authorization header from the incoming request
        const bearerToken = req.headers.authorization;
        // Verify whether the authorization header is present
        if (!bearerToken) {
            res.status(401).json({
                success: false,
                message: "Error! Token was not provided."
            });
        }
        //Extract the token remove 'Bearer'
        const token = bearerToken.split(' ')[1];
        // Check if the token exists.
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Error! Token was not provided"
            });
        }
        // Verify the token
        const decodedToken = jwt.verify(token, secretKey);
        // Print the received token and decoded token for debugging purposes
        console.log('Token received:', token);
        console.log('Decoded Token:', decodedToken);
        // Attach Decoded Information to the req Object
        req.user = {
            userId: decodedToken.name,
            email: decodedToken.email,
            role: decodedToken.role
        };
        // Call next() to pass control
        next();
    });
## Integrate the Routes with the Server
- In the `index.js` file, integrate protected route by adding `auth` middleware to the `/products` route:
    ```js
    app.use('/products', auth, productRoutes);
## Testing
### Part One
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
### Part Two
- Register a User:
    * Method: POST
    * Endpoint: http://localhost:3000/auth/register
    * Response:
        ```json
        "name": "John Doe",
        "email": "john@example.com",
        "password": "$2a$10$tXbtToy91ckxhckjxLHcjkxLCHkScnkj",
        "role": "user",
        "_id": "676236d932e701bdff2c2",
        "__v": 0
    * Screenshot:
    ![register user](</img/registerUser.png>)
- Login a User:
    * Method: POST
    * Endpoint: http://localhost:3000/auth/login
    * Response:
        ```json
        {
            "message": "Login successful",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NjIzMzZkOTMyZTcwMWJkZmYyYzIwNyIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM0NTM0OTUyLCJleHAiOjE3MzUxMzk3NTJ9.LHRTRaXxnaP3Zt1SaIk7NbZVeSiOUSJV9rrhozVCav0"
        }
    * Screenshot:
    ![login user](</img/loginUser.png>)
    * Copy the token from the response.
- Access Protected Product Routes:
    * Method: GET
    * Endpoint: http://localhost:3000/products
    * Header: Authorization: Bearer <your_jwt_token>
    * Response:
        ```json
        {
            "_id": "676229317a3bdccdf6a116f0",
            "name": "Cappuccino",
            "description": "Classic Italian coffee with steamed milk and a velvety foam topping.",
            "price": 4,
            "category": "Beverages",
            "stock": null,
            "imageUrl": "cappuccino.jpg",
            "__v": 0
        },
        {
            "_id": "67622a587a3bdccdf6a116f2",
            "name": "Blueberry Muffin",
            "description": "Freshly baked muffin with juicy blueberries.",
            "price": 3,
            "category": "Pastries",
            "imageUrl": "blueberry_muffin.jpg",
            "__v": 0
        }
    * Screenshot:
    ![protected route](</img/protectedRoute.png>)
