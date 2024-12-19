const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

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
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    // res.json({ message: `Hello User: ${id}`});
})
// Update a user by ID
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const { name, email, password, role } = req.body;
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
        }
        if (role) user.role = role;
        await user.save();
        res.json(user);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    // res.json({ message: `User: ${id} Updated.` })
})
// Delete a user by ID
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied.' });
      }
      try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    // res.json({ message: `User: ${id} deleted.`});
})


// Export router from users.js
module.exports = router;