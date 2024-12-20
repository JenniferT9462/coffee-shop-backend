# Day Three
## Add More Endpoints to the API
- Create a new file named `users.js` inside the `routes` directory.
- Make sure you import all necessary files and dependencies:
    ```js
    const express = require('express');
    const router = express.Router();
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
## Routes
- Get all Users (Admin Only):
    ```js
    router.get('/', async (req, res) => {
    // res.json({ message: "Hello Users"})
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied.' });
      }
      try {
        const users = await User.find();
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
- Get a Single User:
    ```js
    router.get('/:id', async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
        } catch (error) {
             res.status(500).json({ error: error.message });
        }
    });
- Update a User by ID:
    ```js
    router.put('/:id', async (req, res) => {
        try {
            const { name, email, password, role } = req.body;
            const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
         }
        if (role) user.role = role;
        await user.save();
        res.json(user);
        } catch (error) {
             res.status(400).json({ error: error.message });
        }
    });
- Delete a User by ID (Admin Only):
    ```js
    router.delete('/:id', async (req, res) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied.' });
        }
        try {
            const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
- Export Router:
    ```js
    module.exports = router;
- Integrate User Routes with the Server:
    - Import router from `routes/users.js` in `index.js`.
        ```js
        const userRoutes = require('./routes/users');
    - Use `userRoutes`:
        ```js
        app.use('/users', auth, userRoutes);

## Refine Product Endpoints
- In `routes/products.js` update the Get All Products to filter category or get all:
    ```js
    router.get('/', async (req, res) => {
        try {
            const { category } = req.query;
            const filter = category ? { category } : {};
            const products = await Product.find(filter);
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
## Handle Errors and Edge Cases
- Create Error Handling Middleware:
    - The `errorHandler` middleware is responsible for catching and responding to errors that occur during the processing of HTTP requests in your application.
    - It acts as a centralized mechanism for handling errors, ensuring that unexpected issues `don’t crash your server` and providing a consistent response to clients when errors occur.
    ```js
    const errorHandler = (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Something went wrong!' });
    };
- Export the `errorHandler`:
    ```js
    module.exports = errorHandler;
- Import middleware and use in `index.js`:
    ```js
    // Import errorHandler
    const errorHandler = require('./middleware/errorHandler');
    // Use errorHandler
    app.use(errorHandler);
## Testing
- NOTE: If you click on the collection `coffee-shop` and go to `Auth` you can put the `admin` Bearer token in for all routes associated with the `coffee-shop` collection. This way you don't have to input the `header` for every route. 
- Get All Users (Admin Only):
    * Method: GET
    * Endpoint: http://localhost:3000/users
    * Header: Authorization: Bearer <admin_jwt_token>
    * Screenshot:
    ![get all users admin](</img/getUsersAdmin.png>)
- Get a Single User by ID:
    * Method: GET
    * Endpoint: http://localhost:3000/users/<user_id>
    * Header: Authorization: Bearer <user_jwt_token>
    * Screenshot:
    ![get single user](</img/getSingleUser.png>)
- Update a User by ID:
    * Method: PUT
    * Endpoint: http://localhost:3000/users/<user_id>
    * Header: Authorization: Bearer <user_jwt_token>
    * Screenshot:
    ![update user by id](</img/updateUser.png>)
- Delete a User by ID (Admin Only):
    * Method: DELETE
    * Endpoint: http://localhost:3000/users/<user_id>
    * Header: Authorization: Bearer <admin_jwt_token>
    * Screenshot:
    ![delete user by id admin](</img/deleteAdmin.png>)
- Get All Products or Filter by Category:
    * Method: GET
    * Endpoint (category):  http://localhost:3000/products?category=mugs
    * Endpoint (all): http://localhost:3000/products
    * Screenshot:
    - By Category:
    ![get all products by category](</img/getAllProductsCategory.png>)
    - Get All Products:
    ![get all products](</img/getAllProducts.png>)
- Get a Single Product by ID:
    * Method: GET
    * Endpoint:  http://localhost:3000/products/<product_id>
    * Screenshot:
    ![get single product by id](</img/getSingleProduct.png>)
- Update a Product by ID:
    * Method: PUT
    * Endpoint: http://localhost:3000/products/<product_id>
    * Screenshot:
    ![update product by id](</img/updateProduct.png>)
- Delete a Product by ID:
    * Method: DELETE
    * Endpoint: http://localhost:3000/products/<product_id>
    * Screenshot:
    ![delete product by id](</img/deleteProduct.png>)
- Error Handler:
    * Screenshot:
    ![error handler](</img/errorHandler.png>)