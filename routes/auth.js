const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

//Use jwt secret key
const secretKey = process.env.JWT_SECRET;
const secretKeyExpires = process.env.JWT_EXPIRES_IN;

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
router.post('/login', async (req, res) => {
    // Extract email and password from request body
    const { email, password } = req.body;

    try {
        // Step 1: Find the user by email
        const user = await User.findOne({ email });
        // If not user send error
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        } 

        // Step 2: Compare provided password with the hashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        // Step 3: Generate a JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            // Secret key for signing 
            secretKey, 
            // Token expiration
            { expiresIn: secretKeyExpires }
        );
        // User without password
        const userData = {
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
        // Step 4: Send response with the token
        res.status(200).json({ message: "Login successful", token, userData })
    } catch (error) {
        // Log the error for debugging
        console.error(error);
        // Return a server error
        res.status(500).json({ error: "Server error" });
    }
})

//Export routes
module.exports = router;