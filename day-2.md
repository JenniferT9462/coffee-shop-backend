# Day Two
## Install Dependencies
- Install `bcrypt` for password hashing and `jsonwebtoken` for authorization. 
    ```bash
    npm install bcryptjs jsonwebtoken
## Create the User Model
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
## Implement Registration and Login Routes
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