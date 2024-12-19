const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const auth = require('../middleware/auth');
// const bcrypt = require('bcryptjs');

// Get all users - admin only
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
// Get a single user by ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.json({ message: `Hello User: ${id}`});
})
// Update a user by ID
router.put('/:id', (req, res) => {
    const id = req.params.id;
    res.json({ message: `User: ${id} Updated.` })
})
// Delete a user by ID
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    res.json({ message: `User: ${id} deleted.`});
})


// Export router from users.js
module.exports = router;