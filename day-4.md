# Day Four
## Implement Pagination for Product Listings
### Update Product Routes to Include Pagination
- In the `routes/products.js` file, update the `GET` route to include pagination.
- The updated `GET` handler extracts query parameters from the request to manage pagination, filtering, and sorting:
    * `page` (default: 1): The current page number.
    * `limit` (default: 10): The number of products per page.
    * `category`: Filter products by category.
    * `sortBy`: The field name to sort the products by.
    * `sortOrder` (default: 'asc'): The order of sorting ('asc' for ascending or 'desc' for descending).
    - Example `req.query`:
    ```js
    const {
        page = 1,
        limit = 10,
        category,
        sortBy,
        sortOrder = 'asc',
    } = req.query;
- To filter by category:
    * If a category is provided, a filter object is created to fetch products matching that category. If not, an empty filter is used to retrieve all products.
    ```js
    const filter = category ? { category } : {};
- To sort results: 
    * If sortBy is specified, a sort object is created to sort the results based on the provided field and order. The sort order is determined by sortOrder, where 'asc' corresponds to 1 (ascending) and 'desc' corresponds to -1 (descending).
    ```js
    const sort = sortBy ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 } : {};
- Querying the Database:
    * The `Product.find(filter)` method retrieves products based on the filter. The query is further refined by applying sorting, limiting the number of results, and skipping a certain number of documents to implement pagination:
    ```js
    const products = await Product.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((page - 1) * limit);
- Counting Total Documents: 
    * The total number of products matching the filter is retrieved using `Product.countDocuments(filter)`. This is useful for frontend applications to know the total number of available products for pagination purposes.
    ```js
    const total = await Product.countDocuments(filter);
- Example of  updated `GET` route:
    ```js
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
    });
- Example Usage:
    ```bash
    GET /?page=2&limit=5&category=beverages&sortBy=price&sortOrder=desc

## Handle File Uploads for Product Images
### Install Multer for File Uploads
- `Multer` is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. <https://www.npmjs.com/package/multer>
- Install dependencies:
    ```bash
    npm install multer
### Set Up Multer Middleware
- Import necessary dependencies:
    ```js
    const multer = require('multer');
    const path = require('path');
- Set Storage Engine:
    * `destination`: Specifies the folder where uploaded files will be stored (./uploads/ in this case).
    * `filename`: Customizes the saved file name to include the field name, current timestamp, and the original file extension.
    * Example code:
        ```js
        const storage = multer.diskStorage({
            destination: './uploads/',
            filename: function (req, file, cb) {
                cb(
                    null,
                    file.fieldname + '-' + Date.now() + path.extname(file.originalname)
                );
            },
        });
- Initialize Upload:
    * `limits.fileSize`: Restricts the file size to 1 MB (1000000 bytes).
    * `.single('image')`: Accepts a single file upload and associates it with the image field in the form data.
    * Example code: 
        ```js
        const upload = multer({
            storage: storage,
            limits: { fileSize: 1000000 },
            fileFilter: function (req, file, cb) {
                checkFileType(file, cb);
            },
        }).single('image');
- Check File Type:
    * The `checkFileType` function checks both the file extension (extname) and MIME type (mimetype) against allowed types (jpeg|jpg|png|gif).
    * Example code:
        ```js
        function checkFileType(file, cb) {
            const filetypes = /jpeg|jpg|png|gif/;
            const extname = filetypes.test(
                path.extname(file.originalname).toLowerCase()
            );
            const mimetype = filetypes.test(file.mimetype);

            if (mimetype && extname) {
                return cb(null, true);
            } else {
                cb('Error: Images Only!');
            }
        }
- Export the Middleware:
    ```js
    module.exports = upload;
### Update Product Routes to Handle File Uploads
- In the `routes/products.js` file, update the `POST` and `PUT` routes. 
- Import Upload Middleware:
    ```js
    const upload = require('../middleware/upload');
- Key Differences for the `POST` route:
    * Add `upload` middleware to routes.
        ```js
         router.post('/', upload, async (req, res) => {});
    * Extract the request body:
        ```js
        const { name, description, price, category, stock } = req.body;
    * Check for the `imageUrl`:
        ```js
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    * Updated New Product creation:
        ```js
          const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl,
        });
- Example `POST` route:
    ```js
    router.post('/', upload, async (req, res) => {
        try {
            const { name, description, price, category, stock } = req.body;
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
            const product = new Product({
                name,
                description,
                price,
                category,
                stock,
                imageUrl,
            });
            await product.save();
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }); 
- Key Differences for the `PUT` route:
    * Find by Id and Update:
        ```js
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, category, stock, imageUrl },
            { new: true, runValidators: true }
        );
- Example `PUT` route:
    ```js
    router.put('/:id', upload, async (req, res) => {
        try {
            const { name, description, price, category, stock } = req.body;
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
            const product = await Product.findByIdAndUpdate(
                req.params.id,
                { name, description, price, category, stock, imageUrl },
                { new: true, runValidators: true }
            );
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
## Integrate File Upload Server: Add upload folder to static files on server
- In the `index.js` file, import `path`:
    ```js
    // Import path from express
    const path = require('path');
- Serve static files
    ```js
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

## Testing
- Test with Thunder Client or Postman:
    * Create a Product with Image Upload:
        - Method: POST
        - Endpoint: http://localhost:3000/products
        - Headers:
            Authorization: Bearer <your_jwt_token>
        - Body: Form Data
            - name: Coffee Mug
            - description: A large coffee mug.
            - price: 12.99
            - category: mugs
            - stock: 100
            - image: Upload a file
        - Screenshot:
        ![image upload](</img/uploadImage.png>)
    * Get All Products with Pagination and Filtering:
        - Method: GET
        - Endpoint: http://localhost:3000/products?page=1&limit=10&category=mugs&sortBy=price&sortOrder=desc
        - Screenshot:
        ![get all products](</img/pagination.png>) 





    


