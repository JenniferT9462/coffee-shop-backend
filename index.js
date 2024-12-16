const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

//Import dotenv
require('dotenv').config();
//Use environment variable
const atlasUri = process.env.ATLAS_URI


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