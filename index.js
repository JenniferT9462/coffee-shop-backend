const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

//Import dotenv
require('dotenv').config();
//Use environment variable
const atlasUri = process.env.ATLAS_URI
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


// Middleware to parse JSON bodies
app.use(express.json());
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
app.use('/products', auth, productRoutes);
//Use auth routes
app.use('/auth', authRoutes);
// Use user routes
app.use('/users', auth, userRoutes)

const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'https://coffee-shop-backend-sm62.onrender.com'],
}));


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});