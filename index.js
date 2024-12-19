const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

//Import dotenv
require('dotenv').config();
//Use environment variable
const atlasUri = process.env.ATLAS_URI

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

// Use the error handling middleware
app.use(errorHandler);
  
//Use products routes
app.use('/products', auth, productRoutes);
//Use auth routes
app.use('/auth', authRoutes);
// Use user routes
app.use('/users', auth, userRoutes)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});