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
const authRoutes = require('./routes/auth')

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

//Use product routes
app.use('/products', productRoutes);
//Use user routes
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});