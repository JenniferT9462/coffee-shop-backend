const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

//Register a new user
router.post('/register', async (req, res) => {
    // Extract the request body containing the user data
    const data = req.body;
    // Create a new User instance with the provided data
    const user = new User({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role
    });

    try {
        // Save the user data to the database
        const savedUser = await user.save();
        console.log(savedUser);
        // Send the saved user data as a JSON response
        res.json(savedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to save user." });
    }
})

//Login a User
router.post('/login', (req, res) => {
    res.json({
        message: "User is now logged in."
    })
})

//Export routes
module.exports = router;