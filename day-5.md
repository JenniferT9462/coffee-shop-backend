# Day Five
## Implement Role-Based Access Control (RBAC)
### Create Middleware for RBAC
- Create a new file inside the `middleware` directory named `role.js`.
- Example `rbac` middleware:
    ```js
    const role = (requiredRole) => {
        return (req, res, next) => {
            if (req.user.role !== requiredRole) {
                return res.status(403).json({ error: 'Access denied.' });
            }
            next();
        };
    };
- Export `role`:
    ```js
    module.exports = role;
### Protect Routes with Roles
- In the `routes/products.js` file:
    * Import `role` middleware:
        ```js
        const role = require('../middleware/role');
- Update the `POST` route with the `role` middleware:
    ```js
    router.post('/', auth, role('admin'), upload, async (req, res) => {})

## Implement Input Validation
### Install Joi for Validation
- In your terminal run:
    ```bash
    npm install joi
### Create Validation Middleware
- Inside `middleware` directory, create a file named `validate.js`.
- Import `Joi`:
    ```js
    const Joi = require('joi');
- Example validate middleware:
    ```js
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
    };
- Export validate middleware:
    ```js
    module.exports = { validateProduct };
### Use Validation Middleware in Routes
- In the `routes/products.js`.
- Import the validate middleware:
    ```js
    const { validateProduct } = require('../middleware/validate');
- Update the `POST` route to include the validate middleware:
    ```js
    router.post(
        '/',
        auth,
        role('admin'),
        upload,
        validateProduct,
    async (req, res) => {})

## Prepare for Deployment
### Set Up Environment Variables
- Make sure that you have a `.env` file at the root of your project. 
- Have your environment variables for the project.
    * Example:
        ```js
        PORT=3000
        MONGODB_URI=your-mongodb-connection-string
        JWT_SECRET=your_jwt_secret
- NOTE: The `.env` file needs to be included in your `.gitignore` file, so the environment variables will not be pushed to github.
### Use Environment Variables in the Application
- Check your `index.js` file to make sure that you are using your environment variables. 
    * Examples:
    ```js
    require('dotenv').config();

    process.env.MONGODB_URI
##  Deploy to Render.com
### Step 1
- Create a Render.com Account
    * Go to [Render.com](https://render.com/) and create an account if you don't have one.
### Step 2
- Create New Web Service:
    * Click on `New` and select `Web Service`.
- Connect Your Repository:
    * Connect your GitHub repository containing the project.
- Configure the Service:
    * Name: `coffee-shop-backend`
    * Environment: `Node`
    * Build Command: `npm install`
    * Start Command: `node index.js`
    * Environment Variables: Add the variables from your `.env` file.
- Deploy:
    * Click `Create Web Service` to start the deployment.
### Test the Deployed API
- Get the URL of Your Deployed API:
    * Once the deployment is complete, get the URL from Render.com.
- Test the Endpoints:



