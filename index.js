'use strict';

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const cors = require('cors');

//Import dotenv
require('dotenv').config();
//Use environment variable
const atlasUri = process.env.ATLAS_URI

app.use(cors());

// Import your routes
const helloRoute = require('./routes/helloRoute');

// Use the routes
app.use(helloRoute);


// Import path from express
const path = require('path');
//Import routes
const productRoutes = require('./routes/products');
//Import user routes
const authRoutes = require('./routes/auth');
// Import auth middleware
const auth = require('./middleware/auth');
// Import user routes
const userRoutes = require('./routes/users');
//Import error middleware
const errorHandler = require('./middleware/errorHandler');
const cartRoutes = require('./routes/cart');


// Middleware to parse JSON bodies
app.use(express.json());


// // /hello route to warm up the backend
// app.get("/hello", (req, res) => {
//   res.status(200).json({ message: "Backend is running!" });
// });
// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static('/tmp/'));

// Connect to MongoDB
mongoose
  .connect(atlasUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Use the error handling middleware
app.use(errorHandler);
  
//Use products routes
app.use('/products', productRoutes);
//Use auth routes
app.use('/auth', authRoutes);
// Use user routes
app.use('/users', userRoutes);

app.use('/cart', cartRoutes);







app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});